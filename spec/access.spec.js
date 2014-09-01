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
            expect(accList).toEqual(['NodeService.addNode()', '$scope.state.selectedOption', 'j','n','x']);
        });
    });

});