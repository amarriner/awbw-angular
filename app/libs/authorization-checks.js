var Game        = require('../models/game');
var User        = require('../models/user');

//
// Private function to check the authenticated property of the given user
//
function isUserAuthenticated (user, callback) {
    if (! user) {
        callback('Missing user', false);
    }
    
    callback(null, user.authenticated || false);
}

//
// Private function to check whether the given user created the given game
//
function userCreatedGame(user, gameId, callback) {
    if (! user) {
        callback('Missing user', null);
    }
    
    if (! gameId) {
        callback('Missing game ID', null);
    }
    
    Game.findById(gameId).populate('creator').exec(function(err, game) {
        if (err) {
            callback('Error retrieving game', null);
        }    
        
        if (game.creator._id.equals(user._id)) {
            callback(null, game);
        }
        
        else {
            callback('Authenticated user did not create this game', null);
        }
    });
}

//
// Private function to check whether the given user created the given map
//
function userCreatedMap(user, mapId, callback) {
    if (! user) {
        callback('Missing user', null);
    }
    
    if (! mapId) {
        callback('Missing map ID', null);
    }
    
    Map.findById(mapId).populate('creator').exec(function(err, map) {
        if (err) {
            callback('Error retrieving map', null);
        }
        
        if (map.creator._id.equals(user._id)) {
            callback(null, map);
        }
        
        else {
            callback('Authenticated user did not create this map', null);
        }
    });
}

//
// Private function to check whether the given user is the game as the authenticated user
// to make sure a user can only update themselves
//
function userIsAuthenticatedUser(user, userId, callback) {
    if (! user) {
        callback('Missing user');
    }
    
    if (! userId) {
        callback('Missing user ID');
    }
    
    if (user._id.equals(userId)) {
        callback(null);
    }
    
    else {
        callback('Authenticated user is not this user', null);
    }
}

module.exports = {
    
    //
    // Checks to see whether a user is authenticated or not.
    // Wrapper to private isUserAuthenticated function
    //
    isUserAuthenticated: function(req, res, next) {
        
        isUserAuthenticated(req.user, function(err, allow) {
            if (err) {
                res.status(500).json({ message: 'Error authenticating user', success: false });
            }
            
            if (allow) {
                next();
            }
            
            else {
                res.status(401).json({ message: 'Not authenticated', success: false });
            }
        });
        
    },
    
    //
    // Check to make sure the user who is updating the game is the creator of that game.
    // Wrapper to private userCreatedGame function
    //
    userCreatedGame: function(req, res, next) {
        
        userCreatedGame(req.user, req.params.game_id, function(err, game) {
            if (err) {
                res.status(401).json({ message: err, success: false });
            }
            
            else {
                req.game = game;
                next();
            }
        });
        
    },
    
    //
    // Check to make sure the user who is updating the map is the creator of that map.
    // Wrapper to private userCreatedMap function
    //
    userCreatedMap: function(req, res, next) {
        
        userCreatedMap(req.user, req.params.map_id, function(err, map) {
            if (err) {
                res.status(401).json({ message: err, success: false });
            }
            
            else {
                req.map = map;
                next();
            }
        });
        
    },
    
    //
    // Check to make sure the user is updating only themselves.
    // Wrapper to private userIsAuthenticatedUser
    //
    userIsAuthenticatedUser: function(req, res, next) {
        
        userIsAuthenticatedUser(req.user, req.params.user_id, function(err) {
            if (err) {
                res.status(401).json({ message: err, success: false });
            }
            
            else {
                next();
            }
        }); 
        
    }
    
};