'use strict';

angular.module('advanceWarsByWeb.units', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/units', {
    templateUrl: 'views/units/units.html',
    controller: 'UnitsCtrl'
  });
}])

.controller('UnitsCtrl', ['$scope', 'Units',
    function($scope, Units) {
        
        $scope.message = Units.getMessage;
        $scope.units = Units.getUnits;

    }
]);