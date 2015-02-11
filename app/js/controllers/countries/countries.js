'use strict';

angular.module('advanceWarsByWeb.countries', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/countries', {
    templateUrl: 'views/countries/countries.html',
    controller: 'CountriesCtrl'
  });
}])

.controller('CountriesCtrl', ['$scope', 'Countries',
    function($scope, Countries) {
        var countries = Countries.query();  
            
        $scope.countries = countries;
    }
]);