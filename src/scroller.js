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
        var dataSource = $parse(dataSourceName);
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
    function linkFun(scope, element, attrs, controller, trancludeFun){
        var dataSource = getDataSource(scope, attrs.infinityScroll);
    }
    return {
        restrict: 'A',
        transclude: 'element',
        priority: 1000,
        terminal: true,
        link: linkFun
    };
});