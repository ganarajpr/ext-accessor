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



function analyze(context,path){
    var fnBody = path.get('body');
    types.visit(fnBody,{
        visitAssignmentExpression : function(path){
            var fp = utils.getFullPath(path);
            var leftExpr = h.getFullAccessorList(path.value.left).join('.');
            console.log(leftExpr);
            var left =  _.find(context.uses,function(us){
                return us.fullExpr === leftExpr;
            });
            console.log(left);
            this.traverse(path);
        },
        visitFunction : function(path){

        }

    });
}


module.exports = {
    analyze : analyze
};