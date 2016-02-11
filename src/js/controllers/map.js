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
            
            /*
            $scope.getCountries = function(err, callback) {
                if (err) {
                    console.log(err);
                    return;
                }
                
                Data.getCountryData().then(function(response) {
                    console.log('Found country data');
                    $scope.countries = response.data;
                    callback(null);
                }).catch(function(response) {
                    callback('Error getting country data'); 
                });
            }
            
            $scope.getTerrain = function(callback) {
                Data.getTerrainData().then(function(response) {
                    console.log('Found terrain data');
                    $scope.terrain = response.data;
                    callback(null);
                }).catch(function(response) {
                    callback('Error getting terrain data'); 
                });                                           
            }

            
            $scope.getTerrain($scope.getCountryData);
            */
            
            Data.getUnitData().then(function(response) {
                
                $scope.units = response.data;
                
                Data.getCountryData().then(function(response) {
                
                    $scope.countries = response.data;
            
                    Data.getTerrainData().then(function(response) {
               
                        $scope.terrain = response.data;
                
                        Map.get('56ba2e146d4875a31f1d66c6').then(function(response) {
                
                            $scope.map = response.data;
                
                            }).catch(function(response) {
                            });
                
                        }).catch(function(response){
                
                    });
            
                }).catch(function(response) { });
                
            }).catch(function(response) { });
            
            $scope.range = function(min, max, step) {
                step = step || 1;
                var input = [];
                for (var i = min; i <= max; i += step) {
                    input.push(i);
                }
                return input;
            }
            
            $scope.getTerrainClass = function(i) {
                return $scope.getCountry(i) + $scope.getTerrainName(i);
            }
            
            $scope.getCountry = function(i) {
                return ($scope.map.tiles[i].country || '');
            }
            
            $scope.getTerrainName = function (i) {
                return $scope.terrain[$scope.map.tiles[i].terrain].name.toLowerCase();
            }

        }   
    ]);
}());