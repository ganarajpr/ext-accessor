var assert = require("assert");
var types = require("ast-types");
var h = require("./helpers");
var n = types.namedTypes;




function getExternals(fnPath){

    var collectedVariables = [];
    var expressions = [];

    types.visit(fnPath,{
        visitVariableDeclarator : function(path){
            var node = path.node;
            collectedVariables.push(node.id.name);
            //var initPath = path.get('init');
            this.traverse(path);
        },
        visitCallExpression : function(path){
            var node = path.node;
            var fullList = h.getFullAccessorList(node);
            console.log(fullList.join("."));
            return false;
        },
        visitMemberExpression : function(path){
            var node = path.node;
            console.log(h.getFullAccessorList(node).join("."));
            return false;
        },
        visitIdentifier : function(path){
            var node = path.node;
            console.log(h.getFullAccessorList(node).join("."));
            return false;
        }
    });

    console.log(collectedVariables);
}



exports.find = function(fnpath){
    return getExternals(fnpath);
};