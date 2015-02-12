'use strict';

var restUrlBase = 'https://awbw-api.amarriner.com/';

// Declare app level module which depends on views, and components
angular.module('advanceWarsByWeb', [
    'ngRoute',
    'ngCookies',
    'advanceWarsByWeb.cos',
    'advanceWarsByWeb.countries',
    'advanceWarsByWeb.login',
    'advanceWarsByWeb.navbar',
    'advanceWarsByWeb.terrain',
    'advanceWarsByWeb.units',
    'advanceWarsByWeb.version',
    'advanceWarsByWebServices'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/cos', {
            templateUrl: 'views/cos/cos.html',
            controller: 'CosCtrl'
        }).
        when('/countries', {
            templateUrl: 'views/countries/countries.html',
            controller: 'CountriesCtrl'
        }).
        when('/terrain', {
            templateUrl: 'views/terrain/terrain.html',
            controller: 'TerrainCtrl'
        }).
        when('/units', {
            templateUrl: 'views/units/units.html',
            controller: 'UnitsCtrl'
        }).
        otherwise({redirectTo: '/units'});
}]).
directive('navbar', function() {
    return {
        templateUrl: 'views/navbar/navbar.html'
    };
});

var advanceWarsByWebServices = angular.module('advanceWarsByWebServices', ['ngResource']);
