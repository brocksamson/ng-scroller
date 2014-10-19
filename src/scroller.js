'use strict';

angular.module('infinity-scroller', [])
.directive('infinityScroll', function($log, $injector, $parse){
    function isDataSource(dataSource){
        return dataSource && angular.isDefined(dataSource) &&
            dataSource.get && angular.isDefined(dataSource.get) &&
            angular.isFunction(dataSource.get);
    }
    function getDataSource(scope, sourceString){
        var match = sourceString.match(/^\s*(\w+)\s+in\s+([\w\.]+)\s*$/);
        if (!match) {
            throw new Error('Expected infinityScroll in form of \'_item_ in _datasource_\' but got \'' + sourceString + '\'');
        }
        var dataSourceName = match[2];
        var getter = $parse(dataSourceName);
        var  dataSource = getter(scope);
        if(!isDataSource(dataSource)){
            try {
                dataSource = $injector.get(dataSourceName);
            }
            catch(e){
                dataSource = null;
            }
            if(!isDataSource(dataSource)){
                throw new Error(dataSourceName + ' is not a valid data source');
            }
        }
        dataSource.$$itemName = match[1];
        return dataSource;
    }
    function linkFun(scope, element, attrs, controller, transcludeFun){
        var dataSource = getDataSource(scope, attrs.infinityScroll);
        var items = dataSource.get(0, 9);
        for (var i = 0; i < items.length; i++) {
            transcludeFun(function(clone, innerScope){
                innerScope[dataSource.$$itemName] = items[i];
                innerScope.$first = i === 0;
                innerScope.$last = i === (items.length - 1);
                // jshint bitwise: false
                innerScope.$odd = !(innerScope.$even = (i&1) === 0);
                // jshint bitwise: true
                element.after(clone);
            });
        }
    }
    return {
        restrict: 'A',
        transclude: 'element',
        priority: 1000,
        terminal: true,
        link: linkFun
    };
});