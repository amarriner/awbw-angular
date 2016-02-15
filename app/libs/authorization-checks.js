var Game        = require('../models/game');
var User        = require('../models/user');

var functions = {
    //
    // Checks to see whether a user is authenticated or not.
    //
    isUserAuthenticated: function(req, res, next) {
        
        if (! req.user) {
            res.status(400).json({ message: 'Missing user', success: false });
        }
        
        if (req.user.authenticated) {
            next();
        }
        
        else {
            res.status(401).json({ message: 'Not authenticated', success: false });
        }
    },
    
    //
    // Check to make sure the user is the active player for the given game
    //
    isActivePlayer: function(req, res, next) {
        if (! req.user) {
            return res.status(400).json({ message: 'Missing user', success: false });
        } 
        
        if (! req.params.gameSlug) {
            return res.status(400).json({ message: 'Missing game slug', success: false });    
        }
        
        Game.findOne({ slug: req.params.gameSlug }).populate('creator players.user').exec(function(err, game) {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving game', success: false });
            }
            
            if (!game) {
                return res.status(404).json({ message: 'Game not found', success: false });
            }
            
            var activePlayer = game.players.filter(function(p) { return p.active; });
            if (activePlayer.length === 1) {
                activePlayer = activePlayer[0];
                
                if (activePlayer.user._id.equals(req.user._id)) {
                    req.game = game;
                    next();
                }
                else {
                    return res.status(400).json({ message: 'Authenticated user not the active player in this game', success: false });    
                }
            }
            
            else {
                return res.status(400).json({ message: 'Cannot determine active player', success: false });
            }
            
        });
    },
    
    //
    // Check to make sure the user who is updating the game is the creator of that game.
    //
    userCreatedGame: function(req, res, next) {

        if (! req.user) {
            return res.status(400).json({ message: 'Missing user', success: false });
        }
    
        if (! req.params.gameSlug) {
            return res.status(400).json({ message: 'Missing game slug', success: false });
        }
    
        Game.findOne({ slug: req.params.gameSlug }).populate('creator').exec(function(err, game) {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving game', success: false });
            }
            
            if (!game) {
                return res.status(404).json({ message: 'Game not found', success: false });
            }
        
            if (game.creator._id.equals(req.user._id)) {
                req.game = game;
                next();
            }
        
            else {
                res.status(401).json({ 
                    message: 'Authenticated user did not create this game',
                    success: false 
                });
            }
        });
        
    },
    
    //
    // Check to make sure the user who is updating the map is the creator of that map.
    //
    userCreatedMap: function(req, res, next) {
        
        if (! req.user) {
            res.status(400).json({ message: 'Missing user', success: false });
            return;
        }
    
        if (! mapSlug) {
            res.status(400).json({ message: 'Missing map slug', success: false });
            return;
        }
    
        Map.findOne({ slug: req.body.mapSlug }).populate('creator').exec(function(err, map) {
            if (err) {
                res.status(500).json({ message: 'Error retrieving map', success: false });
                return;
            }
            
            if (!map) {
                res.status(404).json({ message: 'Map not found', success: false });
                return;
            }
        
            if (map.creator._id.equals(req.user._id)) {
                req.map = map;
                next();
            }
        
            else {
                res.status(401).json({ 
                    message: 'Authenticated user did not create this map',
                    success: false 
                });
            }
        });
        
    },
    
    //
    // Check to make sure the user is updating only themselves.
    //
    userIsAuthenticatedUser: function(req, res, next) {
 
        if (! req.user) {
            res.status(400).json({ message: 'Missing user', success: false} );
            return;
        }
    
        if (! userId) {
            res.status(400).json({ message: 'Missing user ID', success: false} );
            return;
        }
    
        if (req.user._id.equals(userId)) {
            next();
        }
    
        else {
            res.status(400).json({ message: 'Authenticated user is not this user', success: false} );
        }
                
    }
};

module.exports = functions;