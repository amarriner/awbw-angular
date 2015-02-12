'use strict';

angular.module('advanceWarsByWeb.terrain', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/terrain', {
    templateUrl: 'views/terrain/terrain.html',
    controller: 'TerrainCtrl'
  });
}])

.controller('TerrainCtrl', ['$scope', 'Terrain',
    function($scope, Terrain) {
        
        $scope.message = Terrain.getMessage;
        $scope.terrain = Terrain.getTerrain;

    }
]);