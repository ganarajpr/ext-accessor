var esprima = require("esprima");
var assert = require("assert");
var types = require("ast-types");
var h = require("./lib/helpers");
var n = types.namedTypes;


var esprimaOptions = {
    tolerant : true,
    loc : true

};

function parse(fnSource){
    var ast;
    try{
        ast = esprima.parse(fnSource,esprimaOptions);
    }
    catch(c){

    };

    return ast;
}


function storeIfExternal(path,collection){
    var node = path.node;
    var rootAccessor = h.getRootObject(node);
    var rootAccessorScope = path.scope.lookup(rootAccessor);
    if(rootAccessorScope && rootAccessorScope.isGlobal){
        collection.push(h.getFullAccessorList(node).join("."));
        return true;
    }
    return false;
}


function getExternals(ast){
    assert.ok(n.FunctionDeclaration.check(ast.body[0]));
    var collection = [];
    types.visit(ast,{
        visitMemberExpression : function(path){
            var stored = storeIfExternal(path,collection);
                this.traverse(path);
        },
        visitIdentifier : function(path){
            storeIfExternal(path,collection);
            this.traverse(path);
        },
        visitThisExpression : function(path){
            storeIfExternal(path,collection);
            this.traverse(path);
        },
        visitCallExpression : function(path){
            storeIfExternal(path,collection);
            this.traverse(path);
        }

    });
    return collection;

}



exports.getAccessors = function(source){
    var ast = parse(source);
    if(ast){
        return getExternals(ast);
    }
};




