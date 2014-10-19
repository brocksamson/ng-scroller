describe('ng-scroller', function(){
    var scope, compileElement, element;
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
    describe('initial load 1 item', function(){
        var elemHtml;
        beforeEach(function(){
            scope.items = {
                get: function(first, last){
                    return [{
                        id: 1,
                        name: 'name1'
                    }];
                }
            };
            var htmlString = '<div><div infinity-scroll="item in items">' +
                'name:{{item.name}}:end' +
                'first:{{$first}}:end' +
                'last:{{$last}}:end' +
                'even:{{$even}}:end' +
                'odd:{{$odd}}:end' +
                '</div></div>';
            element = compileElement(htmlString, scope);
            elemHtml = element.html();
            element.find('div').length.should.eql(2);
            Should.exist(elemHtml);
        });
        it('should template the item correctly', function(){
            elemHtml.should.containEql('name:name1:end');
        });
        it('should set $first property correctly', function(){
            elemHtml.should.containEql('first:true:end');
        });
        it('should set $last property correctly', function(){
            elemHtml.should.containEql('last:true:end');
        });
        it('should set $even property correctly', function(){
            elemHtml.should.containEql('even:true:end');
        });
        it('should set $odd property correctly', function(){
            elemHtml.should.containEql('odd:false:end');
        });
    });
    describe('aync load 1 item', function(){
        var elemHtml;
        var deferred;
        beforeEach(inject(function($q){
            scope.items = {
                get: function(first, last){
                    deferred = $q.defer();
                    return deferred.promise;
                }
            };
            var htmlString = '<div><div infinity-scroll="item in items">' +
                'name:{{item.name}}:end' +
                'first:{{$first}}:end' +
                'last:{{$last}}:end' +
                'even:{{$even}}:end' +
                'odd:{{$odd}}:end' +
                '</div></div>';
            element = compileElement(htmlString, scope);
            element.find('div').length.should.eql(1);
            deferred.resolve([{
                id: 1,
                name: 'name1'
            }]);
            scope.$digest();
            elemHtml = element.html();
            element.find('div').length.should.eql(2);
            Should.exist(elemHtml);
        }));
        it('should template the item correctly', function(){
            elemHtml.should.containEql('name:name1:end');
        });
        it('should set $first property correctly', function(){
            elemHtml.should.containEql('first:true:end');
        });
        it('should set $last property correctly', function(){
            elemHtml.should.containEql('last:true:end');
        });
        it('should set $even property correctly', function(){
            elemHtml.should.containEql('even:true:end');
        });
        it('should set $odd property correctly', function(){
            elemHtml.should.containEql('odd:false:end');
        });
    });

    // describe('should use height + itemHeight to determine total height', function(){
    //     beforeEach(function(){
    //         var htmlString = '<div><div infinity-scroll="item in items" total-count="count">' +
    //             '{{item.name}}' +
    //             '</div></div>';
    //     });
    //     it('should watch count and adjust height correctly', function(){

    //     });
    //     it('should set top padding div height correctly', function(){

    //     })
    //     it('should set bottom padding div height correctly', function(){

    //     });
    // });
    describe('validation', function(){
        it('should require a properly formatted datasource directive', function(){
            scope.items = {
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