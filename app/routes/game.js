var config      = require('../config');
var express     = require('express');
var Q           = require('q');
var router      = express.Router();

var Game        = require('../models/game');
var Map         = require('../models/map');
var Unit        = require('../models/unit');
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
    
        //
        // Make sure required fields are present
        //
        if (! req.body.name) {
            return res.status(400).json({ message: 'Name is required', success: false });
        }
    
        if (! req.body.map) {
            return res.status(400).json({ message: 'Map is required', success: false });
        }
    
        if (! req.body.country) {
            return res.status(400).json({ message: 'Country is required', success: false });
        }
    
        //
        // Instantiate game
        //
        var game = new Game();
        game.name = req.body.name;
        game.creator = req.user;
        game.map = req.body.map;
        game.players.push({ user: req.user, country: req.body.country, active: true });
        req.game = game;
    
        //
        // Set the slug then save the game 
        //
        setSlug(req).then(utils.saveModel).then(function(game) {
            res.json({ message: 'Game created', success: true, game: game });
        })
        .catch(function(err) {
            res.status(400).json({ message: err, success: false });
        });
        
    });

router.route('/:gameSlug')

    //
    // Delete a game, must have created the game
    //
    .delete(authorizationChecks.userCreatedGame, function(req, res) {
    
        req.game.remove(function(err, game) {
            if (err) {
                return res.status(400).json({ message: err, success: false });
            }
            
            res.json({ message: 'Deleted game', success: true });
        });
    })

    //
    // Get single game
    //
    .get(function(req, res) {
        
        Game.findOne({slug: req.params.gameSlug})
            .populate('map players.user')
            .exec(function(err, game) {
                if (err) {
                    return res.status(400).json({ message: err, success: false });
                }
            
                res.json({ game: game, success: true });
            }
        );
        
    })

    //
    // Update a game, must have created the game
    //
    .put(authorizationChecks.userCreatedGame, function(req, res) {
        
            req.game.name = req.body.name;
            
            req.game.save(function(err) {
                if (err) {
                    return res.status(400).json({ message: err, success: false });
                }
                
                res.json({ message: 'Game updated!', success: true });
            });
        
    });
        
router.route('/build/:gameSlug')
    
    //
    // Build a unit
    //
    .put(authorizationChecks.isActivePlayer, function(req, res) {
        
        var unit = new Unit();
    
        unit.ammo = req.body.unit.ammo;
        unit.fuel = req.body.unit.fuel;
        unit.id = req.body.unit.id;
        unit.country = req.body.unit.country;
        unit.tile = req.body.tile;
        
        req.game.units.push(unit);
    
        req.game.save(function(err) {
            if (err) {
                return res.status(400).json({ message: err, success: false });
            }
            
            res.json({ message: 'Game updated!', success: true });    
        });
        
    });

router.route('/move/:gameSlug')

    //
    // Move a unit
    //
    .put(authorizationChecks.isActivePlayer, function(req, res) {
        
        var i = req.game.units.map(function(u) { if (u) { return u.tile; } }).indexOf(req.body.fromTile);
        req.game.units[i].tile = req.body.toTile;
    
        req.game.save(function(err) {
            if (err) {
                return res.status(400).json({ message: err, success: false });
            }
            
            res.json({ message: 'Game updated!', success: true });    
        });
    });

module.exports = router;