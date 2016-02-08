var Game        = require('../models/game');

module.exports = {
    
    'userCreatedGame': function(user, gameId, callback) {
        
        Game.findById(gameId).populate('creator').exec(function(err, game) {
            if (err) {
                callback(err, false);
            }
        
            var allow = false;
            
            if (game.creator._id.equals(user._id)) {
                console.log('test');
                allow = true;
            }
            
            callback(null, allow);
            
        });
        
    }
    
};