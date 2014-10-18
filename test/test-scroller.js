describe('ng-scroller', function(){
    var scope, compileElement;
    beforeEach(function(){
        module('infinity-scroller');
        inject(function($rootScope, $compile){
            scope = $rootScope.$new();
            compileElement = function(inputHtml, scope){
                var inputElm = angular.element(inputHtml);
                var compiledElement = $compile(inputElm)(scope);
                scope.$digest();
                return compiledElement;
            };
        });
    });
    describe('validation', function(){
        it('should require a properly formatted datasource directive', function(){
            scope.users = {
                get: function(first, last){

                }
            };
            var elmString = '<div infinity-scroll="items"></div>';
            (function(){
                compileElement(elmString, scope)
            }).should.throw('Expected infinityScroll in form of \'_item_ in _datasource_\' but got \'items\'');
        });
        it('should require a get function on the datasource directive', function(){
            scope.items = {};
            var elmString = '<div infinity-scroll="item in items"></div>';
            (function(){
                compileElement(elmString, scope)
            }).should.throw('items is not a valid data source');
        });
    });
})