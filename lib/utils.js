var VerEx = require("verbal-expressions");

var functionTester = VerEx().word().then("()");
var functionExpr = VerEx().find("()");



function isFunction(expr){
    return functionTester.test(expr);
}

//function


function removeFunctionBrackets(expr){
    return functionExpr.replace(expr,"");
}

function removeSubstring(sub,fromString){
    var substr = VerEx().find(sub+'.');
    return substr.replace(fromString,'');
}


function getFullPath(path){
    var fullPath = [];
    if(path){
        fullPath.push(path.name);
    }
    var currentPath = path.parentPath;
    while(currentPath !== null){
        if(currentPath.name !== null){
            fullPath.unshift(currentPath.name);
        }
        currentPath = currentPath.parentPath;
    }
    return fullPath.join('.');

}


function getParentPath(path,parentPathName){
    var currentPath = path;
    while(currentPath.name !== parentPathName){
        currentPath = currentPath.parentPath;
        if(currentPath === null || currentPath.name === null){
            return;
        }
    }
    return currentPath;
}


module.exports = {
    isFunction : isFunction,
    removeFunctionBrackets : removeFunctionBrackets,
    getFullPath : getFullPath,
    removeSubstring : removeSubstring,
    getParentPath : getParentPath
};