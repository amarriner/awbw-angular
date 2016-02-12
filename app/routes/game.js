var config      = require('../config');
var express     = require('express');
var Q           = require('q');
var router      = express.Router();

var Game        = require('../models/game');
var Map         = require('../models/map');
var User        = require('../models/user');

var utils               = require('../libs/utils');
var authorizationChecks = require('../libs/authorization-checks');

//
// Promise wrapper to generating a slug for this game's name
//
function setSlug(req) {
    
    var deferred = Q.defer();
    
    utils.generateSlug(req.game.name, Game).then(function(slug) {
        if (! slug) {
            deferred.reject('Error generating game slug');
            return;
        }
        
        req.game.slug = slug;
        deferred.resolve(req);
                                             
    }).catch(function(err) {
        deferred.reject(err);
    });
    
    return deferred.promise;
}

//
// Promise wrapper to setting the game's map
//
function setMap(req) {
    
    var deferred = Q.defer();
    
    utils.findModelBySlug(req.body.map, Map).then(function(map) {
        if (! map) {
            deferred.reject('Could not find map');
            return;
        }
        
        req.game.map = map;
        deferred.resolve(req.game);
        
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
    .post(authorizationChecks.isUserAuthenticated, function(req, res, next) {
            
        var game = new Game();
        game.name = req.body.name;
        game.creator = req.user;
        req.game = game;
    
        //
        // Call promise wrappers to set the slug, the map, and then save the game 
        //
        setSlug(req).then(setMap).then(utils.saveModel).then(function(game) {
            res.json({ message: 'Game created', success: true, game: game });
        })
        .catch(function(err) {
            res.status(400).json({ message: err, success: false });
        });
        
    });

router.route('/:game_slug')

    //
    // Delete a game, must be authorized
    //
    .delete(authorizationChecks.userCreatedGame, function(req, res) {
    
        Game.remove({
            slug: req.params.game_slug
        }, function(err, game) {
            if (err) {
                res.status(400).json({ message: err, success: false });
            }
            
            res.json({ message: 'Deleted game', success: true });
        });
    })

    //
    // Get single game
    //
    .get(function(req, res) {
        
        Game.findOne({slug: req.params.game_slug}, function(err, game) {
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