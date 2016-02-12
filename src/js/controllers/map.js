(function() {
    'use strict';

    angular.module('advanceWarsByWeb.map', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/maps', {
            templateUrl: 'js/views/maps.html',
            controller: 'MapsCtrl'
        })
        .when('/maps/:slug', {
            templateUrl: 'js/views/map.html',
            controller: 'MapCtrl'
        });
    }])

    .controller('MapCtrl', ['$scope', '$routeParams', 'Map', 'Data', 'Utils',
        function($scope, $routeParams, Map, Data, Utils) {
            
            Data.getAll().then(function(response) {
                
                $scope.menuData = response.menuData;
                $scope.units = response.unitData;
                $scope.countries = response.countryData;
                $scope.terrain = response.terrainData;
                
                Map.get($routeParams.slug).then(function(response) {
                    $scope.map = response; 
                });
                
            });
            
            $scope.utils = Utils;
            
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
    ])
    
    .controller('MapsCtrl', ['$scope', 'Map',
        function($scope, Map) {
            
            Map.get().then(function(response) {
                $scope.maps = response;
            });
            
        }
    ]);
}());
