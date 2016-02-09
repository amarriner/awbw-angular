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
                
            Data.getUnitData().then(function(response) {
                
                $scope.units = response.data;
                
                $scope.unitMenu = [];
                
                for (var i = 0; i < $scope.units.length; i++) {
                    var unit = $scope.units[i];
                    
                    if (unit.movementType == 'T') {
                        $scope.unitMenu.push({ title: unit.name, fn: function() { $scope.clicked(i);} });
                    }
                };
                
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
            
            $scope.clicked = function(unitId) {
                console.log(unitId);
                console.log('clicked ' + $scope.units[unitId].name + ' from inside the controller');
            }
            

        }   
    ]);
}());