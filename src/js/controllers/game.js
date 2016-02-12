(function() {
    'use strict';

    angular.module('advanceWarsByWeb.game', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/games', {
            templateUrl: 'js/views/games.html',
            controller: 'GamesCtrl'
        })
        .when('/games/create', {
            templateUrl: 'js/views/game-create.html',
            controller: 'GameCreateCtrl'
        })
        .when('/games/:slug', {
            templateUrl: 'js/views/game.html',
            controller: 'GameCtrl'
        });
    }])

    .controller('GameCtrl', ['$scope', '$routeParams', 'Game', 'Data', 'Utils',
        function($scope, $routeParams, Game, Data, Utils) {
            
            Data.getAll().then(function(response) {
                
                $scope.menuData = response.menuData;
                $scope.units = response.unitData;
                $scope.countries = response.countryData;
                $scope.terrain = response.terrainData;
                
                Game.get($routeParams.slug).then(function(response) {
                    $scope.game = response.data; 
                });
                
            });
            
            $scope.utils = Utils;
            
        }   
    ])
    
    .controller('GamesCtrl', ['$scope', 'Game', 'SweetAlert',
        function($scope, Game, SweetAlert) {
            
            Game.get().then(function(response) {
                $scope.games = response.data;
            });
            
            $scope.deleteGame = function(game) {
                SweetAlert.swal({
                    title: 'Delete ' + game.name,
                    text: 'Are you sure you want to delete this game?',
                    type: 'warning',
                    showCancelButton: true
                }, function(isConfirm) {
                    if (isConfirm) {
                        Game.delete(game.slug).then(function(response) {
                            if (response.status === 200) {
                                $scope.games.splice($scope.games.indexOf(game), 1);    
                            }
                        })
                        .catch(function(response) {
                            SweetAlert.swal({title: 'Error', text: response.data.message });
                        });
                    }
                });   
            };
        }
    ])
    
    .controller('GameCreateCtrl', ['$scope', '$location', 'Game', 'Map', 'SweetAlert',
        function($scope, $location, Game, Map, SweetAlert) {
            
            $scope.game = {};
            
            $scope.bD = false;
            
            Map.get().then(function(response) {
                $scope.maps = response.data;
            });
            
            $scope.createGame = function() {
                
                $scope.bD = true;
                
                if (! $scope.game.name) {
                    SweetAlert.swal({title: 'Error', text: 'Name is required'}, function() { $scope.bD = false; });
                    return;
                }
                
                if (! $scope.game.map) {
                    SweetAlert.swal({title: 'Error', text: 'Map is required'}, function() { $scope.bD = false; });
                    return;
                }

                Game.post($scope.game).then(function(response) {
                    SweetAlert.swal({title: 'Success', text: 'Game created successfully'}, function() {
                        $location.path('/games/' + response.data.game.slug);    
                    });
                }).catch(function(response) {
                    SweetAlert.swal({title: 'Error', text: response.data.message }, function() { 
                        $scope.bD = false; 
                        
                        if (response.status === 401) {
                            $location.path('/login');
                        }
                    });
                });
                
            };
            
        }
    ]);
}());
