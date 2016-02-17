var Q       = require('q');
var slug    = require('slug');

var utils = {
    
    //
    // Function to get run at the beginning of a player's turn
    //
    startTurn: function(game) {
        
        var i = utils.getActivePlayerIndex(game);
        
        //
        // Add funds
        // (TODO) Will need to address captured/changed country properties
        //
        if (game.map.tiles) {
            game.map.tiles.forEach(function(tile, ndx) {
                if (tile.country === game.players[i].country) {
                    game.players[i].funds += 1000;
                } 
            });
        }

        //
        // Reset unit moved
        //
        if (game.units) {
            game.units.forEach(function(unit, ndx) {
                if (unit.country === game.players[i].country) {
                    game.units[ndx].moved = false;
                }
            });
        }
        
        //
        // Save the game and continue
        //
        return game;
        
    },
    
    //
    // Get the active player's index from the game.players array
    //
    getActivePlayerIndex: function(game) {
        return game.players.map(function(p) { return p.active; }).indexOf(true);
    },

    //
    // Abstract promise wrapper to finding a model by its ID
    //
    findModelById: function(id, Model) {
        
        var deferred = Q.defer();
        Model.findById(id, function(err, model) {
            if(err) {
                return deferred.reject(err);
            }
            
            deferred.resolve(model);
            
        });
        
        return deferred.promise;
    },
    
    //
    // Abstract promise wrapper to find a model by a slug
    //
    findModelBySlug: function(slug, Model) {
    
        var deferred = Q.defer();
        Model.findOne({slug: slug}, function(err, model) {
            if (err) {
                return deferred.reject(err);
            }
            
            deferred.resolve(model);
        
        });
        
        return deferred.promise;
    },
    
    //
    // Abstract promise wrapper to generating a slug based on the 
    // incoming string. Will check for a Model with the generated 
    // slug, and if one is found will increment to ensure 
    // uniqueness.
    //
    generateSlug: function (s, Model) {
    
        var deferred = Q.defer();
        var newSlug = slug(s);
    
        Model.count({ slug: new RegExp('^' + newSlug + '(-([0-9])+)?$') }, function(err, c) {
            if (err) {
                return deferred.reject(err);
            }
       
            if (c === 0) {
                return deferred.resolve(newSlug);
            }
        
            deferred.resolve(slug(s + '-' + c));
    
        });
    
        return deferred.promise;
    },
    
    //
    // Abstract promise wrapper to save a model instance
    //
    saveModel: function(model) {
        
        var deferred = Q.defer();
        
        model.save(function(err) {
            if (err) {
                return deferred.reject(err);
            }

            deferred.resolve(model);
        });
        
        return deferred.promise;
    }

};
    
module.exports = utils;    