(function() {
    'use strict';

    var module = angular.module('advanceWarsByWeb', [
        'ngRoute',
        'ui.bootstrap',
        'advanceWarsByWeb.navbar'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'js/views/index.html'
        });
    }]);

}());