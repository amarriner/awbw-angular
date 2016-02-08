var Game        = require('../models/game');
var User        = require('../models/user');

module.exports = {
    
    //
    // Check to make sure the authenticatedUser from the request object, is the 
    // same user that is being updated
    //
    'isUserThisAuthenticatedUser': function(authenticatedUser, userId, callback) {
        
        User.findById(userId, function(err, user) {
            if (err) {
                callback(err, false);
            }
            
            var allow = false;
            
            if (authenticatedUser._id.equals(userId)) {
                allow = true;
            }
            
            callback(null, allow);
        });
        
    },
    
    //
    // Check to make sure the user who is updating the game, is the creator of that game
    //
    'userCreatedGame': function(user, gameId, callback) {
        
        Game.findById(gameId).populate('creator').exec(function(err, game) {
            if (err) {
                callback(err, false);
            }
        
            var allow = false;
            
            if (game.creator._id.equals(user._id)) {
                allow = true;
            }
            
            callback(null, allow);
            
        });
        
    }
    
};