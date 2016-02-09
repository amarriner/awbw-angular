(function() {
    'use strict';

    var module = angular.module('advanceWarsByWeb', [
        'ngRoute',
        'ui.bootstrap',
        'advanceWarsByWeb.login',
        'advanceWarsByWeb.loginService',
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
    ]);

}());