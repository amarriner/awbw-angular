var Game        = require('../models/game');
var User        = require('../models/user');

var functions = {
    //
    // Checks to see whether a user is authenticated or not.
    //
    isUserAuthenticated: function(req, res, next) {
        
        if (! req.user) {
            res.status(400).json({ message: 'Missing user' });
        }
        
        if (req.user.authenticated) {
            next();
        }
        
        else {
            res.status(401).json({ message: 'Not authenticated' });
        }
    },
    
    //
    // Check to make sure the user is the active player for the given game
    //
    isActivePlayer: function(req, res, next) {
        if (! req.user) {
            return res.status(400).json({ message: 'Missing user' });
        } 
        
        if (! req.params.gameSlug) {
            return res.status(400).json({ message: 'Missing game slug' });    
        }
        
        Game.findOne({ slug: req.params.gameSlug }).populate('creator players.user map').exec(function(err, game) {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving game' });
            }
            
            if (!game) {
                return res.status(404).json({ message: 'Game not found' });
            }
            
            var activePlayer = game.players.filter(function(p) { return p.active; });
            if (activePlayer.length === 1) {
                activePlayer = activePlayer[0];
                
                if (activePlayer.user._id.equals(req.user._id)) {
                    req.game = game;
                    next();
                }
                else {
                    return res.status(400).json({ message: 'Authenticated user not the active player in this game' });    
                }
            }
            
            else {
                return res.status(400).json({ message: 'Cannot determine active player' });
            }
            
        });
    },
    
    //
    // Check to make sure the user who is updating the game is the creator of that game.
    //
    userCreatedGame: function(req, res, next) {

        if (! req.user) {
            return res.status(400).json({ message: 'Missing user' });
        }
    
        if (! req.params.gameSlug) {
            return res.status(400).json({ message: 'Missing game slug' });
        }
    
        Game.findOne({ slug: req.params.gameSlug }).populate('creator').exec(function(err, game) {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving game' });
            }
            
            if (!game) {
                return res.status(404).json({ message: 'Game not found' });
            }
        
            if (game.creator._id.equals(req.user._id)) {
                req.game = game;
                next();
            }
        
            else {
                res.status(401).json({ 
                    message: 'Authenticated user did not create this game'
                });
            }
        });
        
    },
    
    //
    // Check to make sure the user who is updating the map is the creator of that map.
    //
    userCreatedMap: function(req, res, next) {
        
        if (! req.user) {
            res.status(400).json({ message: 'Missing user' });
            return;
        }
    
        if (! mapSlug) {
            res.status(400).json({ message: 'Missing map slug' });
            return;
        }
    
        Map.findOne({ slug: req.body.mapSlug }).populate('creator').exec(function(err, map) {
            if (err) {
                res.status(500).json({ message: 'Error retrieving map' });
                return;
            }
            
            if (!map) {
                res.status(404).json({ message: 'Map not found' });
                return;
            }
        
            if (map.creator._id.equals(req.user._id)) {
                req.map = map;
                next();
            }
        
            else {
                res.status(401).json({ 
                    message: 'Authenticated user did not create this map'
                });
            }
        });
        
    },
    
    //
    // Check to make sure the user is updating only themselves.
    //
    userIsAuthenticatedUser: function(req, res, next) {
 
        if (! req.user) {
            res.status(400).json({ message: 'Missing user'} );
            return;
        }
    
        if (! userId) {
            res.status(400).json({ message: 'Missing user ID'} );
            return;
        }
    
        if (req.user._id.equals(userId)) {
            next();
        }
    
        else {
            res.status(400).json({ message: 'Authenticated user is not this user' } );
        }
                
    }
};

module.exports = functions;