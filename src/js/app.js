(function() {
    'use strict';

    var module = angular.module('advanceWarsByWeb', [
        'ngResource',
        'ngRoute',
        'oitozero.ngSweetAlert',
        'ui.bootstrap',
        'ui.bootstrap.popover',
        'advanceWarsByWeb.coData',
        'advanceWarsByWeb.dataService',
        'advanceWarsByWeb.game',
        'advanceWarsByWeb.gameService',
        'advanceWarsByWeb.login',
        'advanceWarsByWeb.loginService',
        'advanceWarsByWeb.map',
        'advanceWarsByWeb.mapService',
        'advanceWarsByWeb.navbar',
        'advanceWarsByWeb.utilsService'
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

    module.factory('authInterceptor', ['$window', '$location', '$q',
        function($window, $location, $q) {
            return {
                request: function(config) {
                    config.headers = config.headers || {};
                    if ($window.sessionStorage.token) {
                        config.headers['x-access-token'] = $window.sessionStorage.token;
                    }

                    return config;
                },
            
                response: function(response) {
                    return response;
                },
            
                responseError: function(rejection) {

                    if ($location.path() !== "/login") {
                        $window.sessionStorage.previousLocation = $location.path();
                
                        // if (rejection.status === 401) {
                        //     $location.path('/login');
                        // }
                    }
                
                    return $q.reject(rejection);
                }
            };
        }
    ]).config(['$httpProvider',
        function($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        }
    ]);
    
} ());