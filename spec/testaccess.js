var acc = require('../index.js');
var _ = require('lodash');

function fi(){
    var node = NodeService.addNode($scope.state.selectedOption);
    while(j < n,n<x){ j++;}
}

function testFn(){
    var node = NodeService.addNode($scope.state.selectedOption);
    console.log(node.abc);
    node.abc = console.log().a;

    switch ( man().c.a() ){
        default :
            hello();
            break;
    }
    node.properties;
    $scope.a;
    a;
    b().a;
    testFn();
    do {
        this.terminate = true;
        this.matter();
    }
    while(i<are);
    $scope.state.selectedOption = "";
}


function handleFirstFunction(parts){
    "use strict";
    var identifier;
    var first = _.first(parts);
    identifier = getFuncName(first);
    prg.addVariable(identifier);
    if(parts.length > 1){
        var idassign = prg.getAssignment(identifier);
        if(!idassign){
            var newfe = new create.FunctionExpression();
            prg.addAssignment(new create.Identifier(identifier),newfe);
            addToFunction(newfe, _.rest(parts));
        }
        else{
            if(idassign.right.type === "FunctionExpression"){
                addToFunction(idassign.right, _.rest(parts));
            }
        }

    }
    else{
        var funct = new create.FunctionExpression();
        funct.addReturn(new create.Literal(1));
        prg.addAssignment(new create.Identifier(identifier),funct);
    }
}


function first(array, callback, thisArg) {
    var n = 0,
        length = array ? array.length : 0;

    if (typeof callback != 'number' && callback != null) {
        var index = -1;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
            n++;
        }
    } else {
        n = callback;
        if (n == null || thisArg) {
            return array ? array[0] : undefined;
        }
    }
    return slice(array, 0, nativeMin(nativeMax(0, n), length));
}


function a() {
    angular.module("layout")
        .controller("OverlayController", [
            '$scope',
            'NodeService',
            function OverlayController($scope,NodeService) {
                $scope.options = [
                    "Box",
                    "Link",
                    "List",
                    "Text",
                    "Input",
                    "Button",
                    "Image"
                ];
                $scope.state = {};
                $scope.state.selectedOption = "";
                $scope.$watch("state.selectedOption",function(newVal){
                    if(newVal){
                        console.log($scope.state.selectedOption);
                    }
                    for(var bas in newVal){
                        i = i ? true : false;
                    }
                });
                nutan.$watch("state.selectedOption",function(newVal){
                    if(newVal){
                        console.log($scope.state.selectedOption);
                    }
                });

                for( var i = 0 ; i < nutan.length;i++){
                    $scope.addInLoop = function(){
                        var node = NodeService.addNode($scope.state.selectedOption);
                        while(j < n,n<x){ j++;}
                    };
                }

                log();
                $scope.log();
                tre.abc.log().log().a();
                $scope.onAdd = function(){
                    var node = NodeService.addNode($scope.state.selectedOption);
                    console.log(node.abc);
                    node.abc = console.log().a;
                    var m = {
                        aasss : '',
                        process : {
                            bb : trouble.x.y
                        }
                    };
                    switch ( man().c.a() ){
                        default :
                            hello();
                            break;
                    }
                    node.properties;
                    $scope.a;
                    a;
                    b().a;
                    do {
                        this.terminate = true;
                        this.matter();
                    }
                    while(i<are);
                    $scope.state.selectedOption = "";
                };

            }
        ]);
    angular.module("layout");
    $scope.controller();
    var a = m.q.x = function(){

    };

}

var code = a.toString();


var accList = acc.getAccessors(code);
console.log(accList);
//console.log(_.pluck(accList.externals,'fullExpr'), _.pluck(accList.uses,'path'));
//console.log(_.pluck(accList.uses,'fullExpr'));