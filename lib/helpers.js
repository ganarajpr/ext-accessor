var n = require("ast-types").namedTypes;
var _ = require("lodash");

function getFullPath(path){
    var fpath = fullPath(path);
    var fpathReverse = fpath.reverse().join('.');
    return fpathReverse;
}


function fullPath(path){
    var pathNameArray = [];
    if(path){
        pathNameArray.push(path.name);
        pathNameArray = pathNameArray.concat(fullPath(path.parent));
    }
    return pathNameArray;
}

/*
* If you pass an ast for something like a.b.c it will return a
*
* */

function getRootObject(expr){
    if(n.Identifier.check(expr)){
        return expr.name;
    }
    if(n.MemberExpression.check(expr)){
        return getRootObject(expr.object);
    }
    if(n.CallExpression.check(expr)){
        return getRootObject(expr.callee);
    }
    if(n.ThisExpression.check(expr)){
        return "this";
    }
    console.log(expr,"unknown root object type");
}

function getLineNumberForPath(path){
    return path.node.loc.start.line;
}

function getEndObject(expr){
    if(n.Identifier.check(expr)){
        return expr.name;
    }
    if(n.MemberExpression.check(expr)){
        return getEndObject(expr.property);
    }
}


function resolveArray(expr){
    return {
        type : '[]',
        value : ''
    };
}


function resolveObject(expr){
    return {
        type : '{}',
        value : ''
    };
}

function resolveLiteral(expr){
    return {
        type : typeof expr.value,
        value : ''
    };
}


function resolveFunction(expr) {
    return {
        type : '()',
        value : ''
    }
}
function resolveType(expr){
    var acc = getFullAccessorList(expr);
    if(acc.length){
        return {
            type : 'expression',
            value: acc.join('.')
        };
    }
    if(n.Literal.check(expr)){
        return resolveLiteral(expr);
    }
    if(n.ArrayExpression.check(expr)){
        return resolveArray(expr);
    }
    if(n.ObjectExpression.check(expr)){
        return resolveObject(expr);
    }

    if(n.FunctionExpression.check(expr) || n.FunctionDeclaration.check(expr)){
        return resolveFunction(expr);
    }
    if(n.ConditionalExpression.check(expr)){
        return {
            type : typeof true,
            value : ''
        };
    }

}

function getFullAccessorList(expr){
    var list = [];
    if(n.Identifier.check(expr)){
        list.push(expr.name);
    }
    else if(n.MemberExpression.check(expr)){
        list = list.concat(getFullAccessorList(expr.object));
        list = list.concat(getFullAccessorList(expr.property));
    }
    else if(n.CallExpression.check(expr) || n.NewExpression.check(expr)){
        var callee = getFullAccessorList(expr.callee);
        callee [ callee.length - 1 ]+= '()';
        list = list.concat(callee);
    }
    else if(n.ThisExpression.check(expr)){
        list = list.concat("this");
    }
    else{
       // console.warn("Get Full Accessor failed for ", expr.type);
    }
    return list;
}

module.exports = {
    getFullPath : getFullPath,
    getRootObject : getRootObject,
    getEndObject : getEndObject,
    getLine : getLineNumberForPath,
    getFullAccessorList : getFullAccessorList,
    resolveType : resolveType
};
