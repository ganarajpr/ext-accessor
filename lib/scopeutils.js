var types = require("ast-types");
var h = require("./helpers");
var _ = require("lodash");
var utils = require("./utils");


function getNonLocalsIn(forPath){
    var expr = getAllExpressionsInAndScope(forPath);
    var scope = expr.scope;
    return expr.expressions.filter(function(exp){
        return !scope.declares(utils.removeFunctionBrackets(exp.accessor[0])) && exp.accessor[0] !== 'this';
    });
}


function checkIfPathReturnsAValue(path) {
    return path.name === 'init' || path.name === 'right' || path.parentPath.name === 'arguments';
}



function getAccessorForExpression(path){
    var expr = {};
    expr.accessor = h.getFullAccessorList(path.node);
    expr.isRead = checkIfPathReturnsAValue(path);
    return expr;
}


function getAllExpressionsIn(forPath,goIntoChildContexts){
    return getAllExpressionsInAndScope(forPath,goIntoChildContexts).expressions;
}

/**
 * Given a path it will return all the expressions in the ast.
 * */
function getAllExpressionsInAndScope(forPath,goIntoChildContexts){
    var expressions = [];
    var depth = forPath.scope.depth+1;
    var scopeOfExpressions;
    types.visit(forPath,{
        visitMemberExpression : function(path){
            if(!goIntoChildContexts && path.scope.depth > depth){
                return false;
            }
            if(!scopeOfExpressions){
                scopeOfExpressions = path.scope;
            }
            var expr = getAccessorForExpression(path);
            expressions.push(expr);
            return false;
        },
        visitCallExpression : function(path){
            if(!goIntoChildContexts && path.scope.depth > depth){
                return false;
            }
            if(!scopeOfExpressions){
                scopeOfExpressions = path.scope;
            }
            var expr = getAccessorForExpression(path);
            expressions.push(expr);
            this.traverse(path.get('arguments'));
        },
        visitNewExpression : function(path){
            if(!goIntoChildContexts && path.scope.depth > depth){
                return false;
            }
            if(!scopeOfExpressions){
                scopeOfExpressions = path.scope;
            }
            var expr = getAccessorForExpression(path);
            expressions.push(expr);
            this.traverse(path.get('arguments'));
        },
        visitIdentifier : function(path){
            if(!goIntoChildContexts && path.scope.depth > depth){
                return false;
            }
            if(path.name === "key"){
                return false;
            }
            if(!scopeOfExpressions){
                scopeOfExpressions = path.scope;
            }
            var expr = getAccessorForExpression(path);
            expressions.push(expr);
            this.traverse(path);
        }
    });
    return {
        expressions : expressions,
        scope : scopeOfExpressions
    };
}



module.exports = {
    getNonLocalsIn : getNonLocalsIn,
    getAllExpressionsIn : getAllExpressionsIn
};