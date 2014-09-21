var assert = require("assert");
var types = require("ast-types");
var h = require("./helpers");
var _ = require("lodash");
var VerEx = require("verbal-expressions");

var n = types.namedTypes;


var functionTester = VerEx().word().then("()");
var functionExpr = VerEx().find("()");

function Context(){
    this.uses = [];
    this.variables = [];
    this.childContexts = [];
    this.params = [];
}

function collectParams(node,context){
    if(node.params){
        for (var i = 0; i < node.params.length; i++) {
            if( n.Identifier.check(node.params[i]) ){
                context.params.push(node.params[i].name);
            }
        }
    }
}


function Expression(expr,isFn){
    this.raw = expr;
    this.fullExpr = expr.join('.');
    this.isFunction = isFn;
    this.isConstructor = false;
    this.isRead = false;
}


function checkIfPathReturnsAValue(path) {
    return path.name === 'init' || path.name === 'right' || path.parentPath.name === 'arguments';
}

function isFunction(expr){
    return functionTester.test(expr);
}


function getExpressionForNode(path){
    var node = path.node;
    var fullList = h.getFullAccessorList(node);
    var expr = new Expression(fullList,true);
    expr.isRead = checkIfPathReturnsAValue(path);
    return expr;
}

function createContextInfo(fnPath){
    var currentContext = new Context();
    var node = fnPath.node;
    collectParams(node,currentContext);
    var fnBody = fnPath.get('body');
    types.visit(fnBody,{
        visitVariableDeclarator : function(path){
            var node = path.node;
            currentContext.variables.push(node.id.name);
            this.traverse(path);
        },
        visitCallExpression : function(path){
            var node = path.node;
            var expr = getExpressionForNode(path);
            currentContext.uses.push(expr);
            this.traverse(path.get('arguments'));
        },
        visitNewExpression : function(path){
            var node = path.node;
            var expr = getExpressionForNode(path);
            expr.isConstructor = true;
            currentContext.uses.push(expr);
            this.traverse(path.get('arguments'));
        },
        visitFunction : function(path){
            var node = path.node;
            if(node.id && node.id.name){
                currentContext.variables.push(node.id.name+'()');
            }
            currentContext.childContexts.push(createContextInfo(path));
            return false;
        },
        visitCatchClause : function(path){
            //TODO: handle catch clause;
            this.traverse(path);
        },
        visitMemberExpression : function(path){
            var node = path.node;
            var expr = getExpressionForNode(path);
            currentContext.uses.push(expr);
            return false;
        },
        visitIdentifier : function(path){
            var node = path.node;
            if(path.name === "key"){
                return false;
            }
            var expr = getExpressionForNode(path);
            currentContext.uses.push(expr);
            this.traverse(path);
        }
    });
    return currentContext;
}


function getSanitizedExpression(expr){
    var currentExpr;
    if(isFunction(expr)){
        currentExpr = functionExpr.replace(expr,"");
    }
    else{
        currentExpr = expr;
    }
    return currentExpr;
}

function isExpressionGlobal(exprList){
    var i = 0;
    var currentObject = GLOBAL;
    var currentExpr;
    while( i < exprList.length){
        currentExpr = getSanitizedExpression(exprList[i]);
        if(_.has(currentObject,currentExpr)){
            currentObject = currentObject[exprList[i]];
        }
        else{
            return false;
        }
        i++;
    }
    return true;
}

function getListOfExternals(context,parentVariables){

    var consolidatedVars = _.union(parentVariables,context.variables,context.params);
    var filteredExterns = _.filter(context.uses,function(ext){
        return !_.contains(consolidatedVars,getSanitizedExpression(ext.raw[0]));
    });

    var afterGlobalFilter = _.filter(filteredExterns,function(ext){
        return !isExpressionGlobal(ext.raw);
    });

    var joinedExterns = afterGlobalFilter;
    for (var i = 0; i < context.childContexts.length; i++) {
        joinedExterns = _.union( joinedExterns , getListOfExternals(context.childContexts[i],consolidatedVars) , 'fullExpr' );
    }
    context.externals = _.uniq(joinedExterns,'fullExpr');
    return context.externals;

}


function getArguments(context,rootParams){

    rootParams = rootParams || context.params;

    context.args =  [];
    if(!rootParams.length){
        return;
    }
    var filteredExterns = _.filter(context.uses,function(ext){
        return _.contains(rootParams,ext.raw[0]);
    });

    var joinedExterns = _.map(filteredExterns,function(ext){
        return ext.raw.join(".");
    });
    for (var i = 0; i < context.childContexts.length; i++) {
        joinedExterns = _.union( joinedExterns , getArguments(context.childContexts[i],rootParams) );
    }
    context.args = _.uniq(joinedExterns);
}



exports.find = function(fnpath){
    var rootContext = createContextInfo(fnpath);
    getListOfExternals(rootContext);
    getArguments(rootContext);
    return _.omit(rootContext,'childContexts');
};