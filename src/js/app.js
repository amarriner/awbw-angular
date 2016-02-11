(function() {
    'use strict';

    var module = angular.module('advanceWarsByWeb', [
        'ngResource',
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.popover',
        'advanceWarsByWeb.coData',
        'advanceWarsByWeb.dataService',
        'advanceWarsByWeb.login',
        'advanceWarsByWeb.loginService',
        'advanceWarsByWeb.map',
        'advanceWarsByWeb.mapService',
        'advanceWarsByWeb.navbar'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'js/views/index.html'
        });
    }])
    .directive('setFocus', ['$timeout', '$parse', 
        function($timeout, $parse) {
            return {
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.setFocus);
                
                    scope.$watch(model, function(value) {
                        if(value ===true) {
                            $timeout(function() {
                                element[0].focus();
                            });
                        }
                    });

                }
            };
        }
    ])
    .directive('tile', [
        function() {
            return {
                restrict: 'E',
                templateUrl: 'js/views/tile.html'    
            };
        }
    ]);

} ());