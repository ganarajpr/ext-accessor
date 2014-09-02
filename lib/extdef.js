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
            var initPath = path.get('init');
            this.traverse(initPath);
        },
        visitMemberExpression : function(path){

        }
    });

    console.log(collectedVariables);
}



exports.find = function(fnpath){
    return getExternals(fnpath);
};