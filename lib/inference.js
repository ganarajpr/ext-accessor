var types = require("ast-types");
var h = require("./helpers");
var utils = require("./utils");
var _ = require("lodash");


function storeEquality(path,expr){
    if(path.name === 'right'){
        var expressionPath = utils.getParentPath(path,'expression');
        if(expressionPath){
            var exprNode = expressionPath.value;
            if(n.AssignmentExpression.check(exprNode)){
                var leftExpr = h.getFullAccessorList(exprNode.left);
                if(leftExpr){
                    console.log("left is ", leftExpr.join('.'));
                }
            }
        }
    }
}


var equals = [];


function analyze(context,path){
    var fnBody = path.get('body');
    types.visit(fnBody,{
        visitAssignmentExpression : function(path){
            var fp = utils.getFullPath(path);
            var leftExpr = h.getFullAccessorList(path.value.left).join('.');

            var rightExpr = h.resolveType(path.value.right);

            var equality = {
                left : leftExpr,
                right : rightExpr
            };
            equals.push(equality);
            this.traverse(path);
        },
        visitVariableDeclarator : function(path){
            var node = path.node;
            if(node.init){
                var leftExpr = h.getFullAccessorList(node.id).join('.');
                var rightExpr = h.resolveType(node.init);
                var equality = {
                    left : leftExpr,
                    right : rightExpr
                };
                equals.push(equality);
            }
            this.traverse(path);
        },
        visitFunction : function(path){
            this.traverse(path);
        }

    });
    console.log(equals);
}


module.exports = {
    analyze : analyze
};