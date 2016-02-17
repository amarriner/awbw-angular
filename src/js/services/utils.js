(function() {
    'use strict';

    angular.module('advanceWarsByWeb.utilsService', []).factory('Utils', ['Data', 
        function(Data) {

            var terrain;
            var unit;
            var map;
            
            var checkSquare = function(prev, next) {
                
                //
                // Don't process squares off the map
                //
                if (next < 0 || next >= map.tiles.length) { return; }
                
                //
                // Calculate cost to current square, if we're out of 
                // MP or (TODO) fuel, return
                //
                var cost = parseInt(map.tiles[prev].cost) +
                            parseInt(terrain[map.tiles[next].terrain].costs.C[unit.movementType]);
                
                if (cost > unit.movementPoints) { return; }
                
                //
                // If there is a unit in this square, make sure we can pass through it
                //
                if (map.tiles[next].unit) {
                    
                    //
                    // If the unit is from another player, return
                    //
                    if (map.tiles[next].unit.country !== unit) { return; }
                    
                    //
                    // If it's the same country, but the unit would be out of
                    // MP or (TODO) fuel, return
                    // (TODO) Add APC/Lander/T-Copter checks
                    //
                    if (cost === unit.movementPoints) { return; }
                }
                
                //
                // Update cost for current square, and then check neighbors if
                // the cost was less
                //
                if (cost < map.tiles[next].cost) {
                    map.tiles[next].cost = cost;
                
                    //
                    // Only check the square to the left if we're not on the map edge
                    //
                    if (next % map.width) {
                        checkSquare(next, next - 1);
                    }
                
                    //
                    // Only check the square on the right if we're not on the map edge
                    //
                    if ((next + 1) % map.width) {
                        checkSquare(next, next + 1);
                    }
                    
                    //
                    // Check up and down as well
                    //
                    checkSquare(next, next - map.width);
                    checkSquare(next, next + map.width);
                }
            };
            
            var dijkstra = function(u, m, t) {
                                    
                //
                // Set local variables to parameters
                //
                terrain = t;
                unit = u;
                map = m;
                    
                //
                // Initialize map
                //
                for (var i = 0; i < map.tiles.length; i++) {
                    map.tiles[i].cost = 1000;
                }
            
                map.tiles[unit.tile].cost = 0;
                
                //
                // Begin checking squares for costs
                //
                if (unit.tile % map.width) {
                    checkSquare(unit.tile, unit.tile - 1);
                }
            
                if ((unit.tile + 1) % map.width) {
                    checkSquare(unit.tile, unit.tile + 1);
                }
            
                checkSquare(unit.tile, unit.tile - map.width);
                checkSquare(unit.tile, unit.tile + map.width);
            
                return (map);
            };
            
            return {
                
                dijkstra: dijkstra,
                
                range: function(min, max, step) {
                    step = step || 1;
                    var input = [];
                    for (var i = min; i <= max; i += step) {
                        input.push(i);
                    }
                    return input;
                }
                
           };
            
        }
    ]);
}());    
