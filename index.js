var esprima = require("esprima");
var assert = require("assert");
var types = require("ast-types");
var h = require("./lib/helpers");
var extdef = require("./lib/extdef");
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

function getExternals(ast){
    assert.ok(n.FunctionDeclaration.check(ast.body[0]));
    var externals;
    types.visit(ast,{
        visitProgram : function(path){
            externals = extdef.find(path);
            //dont go deeper
            return false;
        }
    });
    return externals;
}



exports.getAccessors = function(source){
    var ast = parse(source);
    if(ast){
        return getExternals(ast);
    }
};




