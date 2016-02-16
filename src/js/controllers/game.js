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

    .controller('GameCtrl', ['$scope', '$routeParams', 'Game', 'Data', 'Utils', 'SweetAlert',
        function($scope, $routeParams, Game, Data, Utils, SweetAlert) {
            
            $scope.utils = Utils;
            
            //
            // Get all static data
            //
            Data.getAll().then(function(response) {
                
                $scope.menuData = response.menuData;
                $scope.units = response.unitData;
                $scope.countries = response.countryData;
                $scope.terrain = response.terrainData;
              
                //
                // Find the game
                //
                Game.get($routeParams.slug).then(function(response) {
                    
                    $scope.game = response.data.game; 
                    
                    //
                    // Determine active player
                    //
                    $scope.activePlayer = $scope.game.players.filter(function(p) { return p.active; });
                    if ($scope.activePlayer.length === 1) {
                        $scope.activePlayer = $scope.activePlayer[0];
                    }
                    else {
                        $scope.activePlayer = '';
                    }
                    
                    //
                    // Adjust map for game-specific objects
                    //
                    $scope.map = $scope.game.map;
                    
                    angular.forEach($scope.game.units, function(unit, i) {
                        unit.movementPoints = $scope.units[unit.id].movementPoints;
                        unit.movementType = $scope.units[unit.id].movementType;
                        $scope.map.tiles[unit.tile].unit = unit;    
                    });
                    
                    console.log($scope.game);
                    
                }).catch(function(response) {
                    SweetAlert.swal({ title: 'Error', text: response.data.message });
                });
                
            });
            
            // ----------------------------------------------------------------
            // Build units
            // ----------------------------------------------------------------
            $scope.buildUnit = function(i, unit) {

                //
                // Set the country of the pending unit to the same as the 
                // active player
                //
                unit.country = $scope.activePlayer.country;
                
                //
                // Send API call 
                //
                Game.put($scope.game.slug, 'build', {
                    unit: unit,
                    tile: i
                }).then(function(response) {
                    
                    //
                    // Add unit to game on the client
                    //
                    unit.tile = i;
                    $scope.game.units.push(unit);
                    
                }).catch(function(response) {
                    SweetAlert.swal({ title: 'Error', text: response.data.message }); 
                });
            };
            
            $scope.movingUnit = '';
            $scope.getMovement = function(u, m) {
                $scope.movingUnit = u;
                $scope.map = Utils.dijkstra(u, m, $scope.terrain);
            };
            
            $scope.clearMovementSquares = function() {
                $scope.movingUnit = '';
                angular.forEach($scope.map.tiles, function(v, k) {
                    $scope.map.tiles[k].cost = 1000;    
                });   
            };
            
            // ----------------------------------------------------------------
            // Move units
            // ----------------------------------------------------------------
            $scope.moveUnit = function(i) {
                
                Game.put($scope.game.slug, 'move', {
                    toTile: i,
                    fromTile: $scope.movingUnit.tile
                }).then(function(response) {
                    
                    // 
                    // Move unit on the client
                    //
                    var i = $scope.game.units.map(function(u) { if (u) { return u.tile; } }).indexOf($scope.movingUnit.tile);
                    $scope.game.units[i].tile = i;
                    $scope.clearMovementSquares();
                    
                }).catch(function(response) {
                    
                    $scope.clearMovementSquares();                    
                    SweetAlert.swal({ title: 'Error', text: response.data.message }); 
                    
                });
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
            
            $scope.getUnitClass = function(i) {
                if (! $scope.map.tiles[i].unit) {
                    return;
                }
                
                return $scope.map.tiles[i].unit.country + $scope.units[$scope.map.tiles[i].unit.id].filename;
            };
            
            $scope.getUnitName = function(i) {
                if (! $scope.map.tiles[i].unit) {
                    return;
                }
                
                return $scope.units[$scope.map.tiles[i].unit.id].name;
            };
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
                    showCancelButton: true
                }, function(isConfirm) {
                    if (isConfirm) {
                        Game.delete(game.slug).then(function(response) {
                            if (response.status === 200) {
                                $scope.games.splice($scope.games.indexOf(game), 1);    
                            }
                        })
                        .catch(function(response) {
                            SweetAlert.swal({ title: 'Error', text: response.data.message });
                        });
                    }
                });   
            };

        }
    ])
    
    .controller('GameCreateCtrl', ['$scope', '$location', 'Data', 'Game', 'Map', 'SweetAlert',
        function($scope, $location, Data, Game, Map, SweetAlert) {
            
            $scope.game = {};
            
            $scope.bD = false;
            
            Map.get().then(function(response) {
                $scope.maps = response.data;
            });
            
            Data.getCountryData().then(function(response) {
                $scope.countryData = response.data;
            });
            
            $scope.changeMap = function() {
                $scope.mapCountries = [];
                angular.forEach($scope.game.map.tiles, function(t, ndx) {
                    var country = $scope.countryData.filter(function(c) {
                        return c.abbreviation === t.country;
                    })[0];
                        
                    if (t.country && $scope.mapCountries.indexOf(country) === -1) {
                        $scope.mapCountries.push(country);
                    }    
                });
                
            };
            
            $scope.createGame = function() {
                
                //
                // Determines whether the create button is disabled or not
                //
                $scope.bD = true;
                
                //
                // Check for required parameters
                //
                if (! $scope.game.name) {
                    return SweetAlert.swal({title: 'Error', text: 'Name is required'}, function() { $scope.bD = false; });
                }
                
                if (! $scope.game.map) {
                    return SweetAlert.swal({title: 'Error', text: 'Map is required'}, function() { $scope.bD = false; });
                }
                
                if (! $scope.game.country) {
                    return SweetAlert.swal({title: 'Error', text: 'Country is required'}, function() { $scope.bD = false; });
                }

                //
                // Attempt to create the game via the API
                //
                Game.post($scope.game).then(function(response) {
                    
                    //
                    // Success, redirect to the game page
                    //
                    SweetAlert.swal({title: 'Success', text: 'Game created successfully'}, function() {
                        $location.path('/games/' + response.data.game.slug);    
                    });
                    
                }).catch(function(response) {
                    
                    //
                    // An error occurred creating the game
                    //
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
