var Game        = require('../models/game');
var User        = require('../models/user');

module.exports = {
    
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
    // Check to make sure the user who is updating the game is the creator of that game.
    //
    
    userCreatedGame: function(req, res, next) {

        if (! req.user) {
            res.status(400).json({ message: 'Missing user', success: false });
            return;
        }
    
        if (! req.params.gameSlug) {
            res.status(400).json({ message: 'Missing game slug', success: false });
            return;
        }
    
        Game.findOne({ slug: req.params.gameSlug }).populate('creator').exec(function(err, game) {
            if (err) {
                res.status(500).json({ message: 'Error retrieving game', success: false });
                return;
            }
            
            if (!game) {
                res.status(404).json({ message: 'Game not found', success: false });
                return;
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