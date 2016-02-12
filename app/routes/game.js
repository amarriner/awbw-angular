var config      = require('../config');
var express     = require('express');
var Q           = require('q');
var router      = express.Router();

var Game        = require('../models/game');
var User        = require('../models/user');

var utils               = require('../libs/utils');
var authorizationChecks = require('../libs/authorization-checks');

//
// Promise wrapper to grabbing a user model and setting it as
// the game's creator
//
function setCreator(userId, game) {
    
    var deferred = Q.defer();
    
    utils.findModelById(userId, User).then(function(user) {
        
        game.creator = user;
        deferred.resolve(game);
        
    }).catch(function(err) {
        deferred.reject(err);
    });
    
    return deferred.promise;
    
}

//
// Promise wrapper to generating a slug for this game's name
//
function setSlug(game) {
    
    var deferred = Q.defer();
    
    utils.generateSlug(game.name, Game).then(function(slug) {
        
        game.slug = slug;
        deferred.resolve(game);
                                             
    }).catch(function(err) {
        deferred.reject(err);
    });
    
    return deferred.promise;
}

//
// GAME ROUTE
//
router.route('/').

    //
    // Get all games
    //
    get(function(req, res) {
        
        Game.find().populate('creator').exec(function(err, games) {
            if(err) {
                res.status(500).send(err);
            }
            
            res.json(games);
        });
        
    })

    //
    // Create new game, must be authenticated
    //
    .post(authorizationChecks.isUserAuthenticated, function(req, res) {
        
        var game = new Game();
        game.name = req.body.name;
        
        //
        // Call promise wrappers to set the creator, set the slug, and then save the game 
        //
        setCreator(req.user._id, game).then(setSlug).then(utils.saveModel).then(function() {
            res.json({ message: 'Game created', success: true });
        })
        .catch(function(err) {
            res.status(400).json({ message: err, success: false });
        });
        
    });

router.route('/:game_id')

    //
    // Delete a game, must be authorized
    //
    .delete(authorizationChecks.userCreatedGame, function(req, res) {
        Game.remove({
            _id: req.params.game_id
        }, function(err, game) {
            if (err)
                res.send(err);
            
            res.json({ message: 'Deleted game' });
        });
    })

    //
    // Get single game
    //
    .get(function(req, res) {
        
        Game.findById(req.params.game_id, function(err, game) {
            if (err)
                res.send(err);
            
            res.json(game);
        });
        
    })

    //
    // Update a game, must be authorized
    //
    .put(authorizationChecks.userCreatedGame, function(req, res) {
        
            req.game.name = req.body.name;
            
            req.game.save(function(err) {
                if (err)
                    res.send(err);
                
                res.json({ message: 'Game updated!' });
            });
        
    });
        

module.exports = router;