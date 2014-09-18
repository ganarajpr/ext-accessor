var acc = require('../index.js');


describe("External Defs",function(){
    var code;
    describe("Simple member expressions",function(){

        beforeEach(function(){
            function testFn(){
                var node = NodeService.addNode($scope.state.selectedOption);
                while(j < n,n<x){ j++;}
            }

            code = testFn.toString();
        });

        it("should list Member Expressions", function(){
            var accList = acc.getAccessors(code);
            expect(accList).toEqual({ externals : ['NodeService.addNode()', '$scope.state.selectedOption', 'j','n','x'], args : [] });
        });
    });

    describe("Inside Loops and Switch statements",function(){

        beforeEach(function(){
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
                do {
                    this.terminate = true;
                    this.matter();
                }
                while(i<are);
                $scope.state.selectedOption = "";
            }

            code = testFn.toString();
        });

        it("should list all externals", function(){
            var accList = acc.getAccessors(code);
            expect(accList).toEqual({
                externals : [ 'NodeService.addNode()', '$scope.state.selectedOption',
                    'console.log()', 'console.log().a', 'man().c.a()', 'hello()', '$scope.a', 'a',
                    'b().a', 'this.terminate', 'this.matter()', 'i', 'are' ],
                args : []
            });
        });
    });


    describe("Functions within functions",function(){

        beforeEach(function(){

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
            code = a.toString();
        });

        it("should list Externals", function(){
            var accList = acc.getAccessors(code);
            expect(accList).toEqual({
                externals : [
                                'angular.module().controller()', 'angular.module()', '$scope.controller()',
                                'm.q.x', 'nutan.$watch()', 'nutan.length', 'log()', 'tre.abc.log().log().a()',
                                'console.log()', 'j', 'n', 'x', 'console.log().a', 'trouble.x.y',
                                'man().c.a()', 'hello()', 'b().a', 'this.terminate',
                                'this.matter()', 'are'
                ],
                args : []
            });
        });
    });


    describe("New statements",function(){

        beforeEach(function(){

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
            code = handleFirstFunction.toString();
        });

        it("should list Externals", function(){
            var accList = acc.getAccessors(code);
            expect(accList).toEqual({
                externals : [ '_.first()', 'getFuncName()', 'prg.addVariable()', 'prg.getAssignment()',
                'create.FunctionExpression()', 'prg.addAssignment()', 'create.Identifier()', 'addToFunction()',
                '_.rest()', 'create.Literal()' ] ,
                args : [ 'parts', 'parts.length' ] });
        });
    });


});