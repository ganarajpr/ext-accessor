var assert = require("assert");
var types = require("ast-types");
var h = require("./helpers");
var _ = require("lodash");
var n = types.namedTypes;

function Context(){
    this.externals = [];
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


function getExternals(fnPath){
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
            var fullList = h.getFullAccessorList(node);
            currentContext.externals.push(fullList);
            this.traverse(path.get('arguments'));
        },
        visitNewExpression : function(path){
            var node = path.node;
            var fullList = h.getFullAccessorList(node);
            currentContext.externals.push(fullList);
            this.traverse(path.get('arguments'));
        },
        visitFunction : function(path){
            var node = path.node;
            if(node.id && node.id.name){
                currentContext.variables.push(node.id.name+'()');
            }
            currentContext.childContexts.push(getExternals(path));
            return false;
        },
        visitCatchClause : function(path){
            //TODO: handle catch clause;
            this.traverse(path);
        },
        visitMemberExpression : function(path){
            var node = path.node;
            currentContext.externals.push(h.getFullAccessorList(node));
            return false;
        },
        visitIdentifier : function(path){
            var node = path.node;
            if(path.name === "key"){
                return false;
            }
            currentContext.externals.push(h.getFullAccessorList(node));
            this.traverse(path);
        }
    });
    return currentContext;
}

function getListOfExternals(context,parentVariables){

    var consolidatedVars = _.union(parentVariables,context.variables,context.params);
    var filteredExterns = _.filter(context.externals,function(ext){
        return !_.contains(consolidatedVars,ext[0]);
    });
    //console.log(context.variables);
    //console.log(context.externals);
    var joinedExterns = _.map(filteredExterns,function(ext){
        return ext.join(".");
    });
    //console.log(joinedExterns);
    for (var i = 0; i < context.childContexts.length; i++) {
        joinedExterns = _.union( joinedExterns , getListOfExternals(context.childContexts[i],consolidatedVars) );
    }
    return _.uniq(joinedExterns);

}


function getArguments(context,rootParams){

    rootParams = rootParams || context.params;

    if(!rootParams.length){
        return [];
    }
    var filteredExterns = _.filter(context.externals,function(ext){
        return _.contains(rootParams,ext[0]);
    });

    var joinedExterns = _.map(filteredExterns,function(ext){
        return ext.join(".");
    });
    //console.log(joinedExterns);
    for (var i = 0; i < context.childContexts.length; i++) {
        joinedExterns = _.union( joinedExterns , getArguments(context.childContexts[i],rootParams) );
    }
    return _.uniq(joinedExterns);
}



exports.find = function(fnpath){
    var rootContext = getExternals(fnpath);
    return {
        externals : getListOfExternals(rootContext),
        args : getArguments(rootContext)
    };
};