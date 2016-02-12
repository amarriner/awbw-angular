(function() {
    'use strict';

    angular.module('advanceWarsByWeb.map', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/maps', {
            templateUrl: 'js/views/map.html',
            controller: 'MapCtrl'
        });
    }])

    .controller('MapCtrl', ['$scope', 'Map', 'Data',
        function($scope, Map, Data) {
            
            Data.getAll().then(function(response) {
                
                $scope.menuData = response.menuData;
                $scope.units = response.unitData;
                $scope.countries = response.countryData;
                $scope.terrain = response.terrainData;
                
                Map.get('56ba2e146d4875a31f1d66c6').then(function(response) {
                    $scope.map = response; 
                });
                
            });
            
            $scope.range = function(min, max, step) {
                step = step || 1;
                var input = [];
                for (var i = min; i <= max; i += step) {
                    input.push(i);
                }
                return input;
            };
            
            $scope.getTerrainClass = function(i) {
                return $scope.getCountry(i) + $scope.getTerrainName(i);
            };
            
            $scope.getCountry = function(i) {
                return ($scope.map.tiles[i].country || '');
            };
            
            $scope.getTerrainName = function (i) {
                return $scope.terrain[$scope.map.tiles[i].terrain].name.toLowerCase();
            };

        }   
    ]);
}());
