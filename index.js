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


//It knows / assumes :
//      That ast has a property called body which is an array
//      That there is an object called types which has a function called visit.
//      What types.visit takes.
//      That there is extdef which has a find function

function getExternals(ast){

    var externals = [];

    if( n.FunctionDeclaration.check(ast.body[0]) ){
        types.visit(ast,{
            visitFunction : function(path){
                externals = extdef.find(path);
                //dont go deeper
                return false;
            }
        });
    }

    return externals;
}



exports.getAccessors = function(source){
    var ast = parse(source);
    if(ast){
        return getExternals(ast);
    }
};




