var config      = require('../config');
var express     = require('express');
var Q           = require('q');
var router      = express.Router();

var Game        = require('../models/game');
var Map         = require('../models/map');
var Unit        = require('../models/unit');
var UnitData    = require('../data/unit-data');
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
            return res.status(400).json({ message: 'Name is required' });
        }
    
        if (! req.body.map) {
            return res.status(400).json({ message: 'Map is required' });
        }
    
        if (! req.body.country) {
            return res.status(400).json({ message: 'Country is required' });
        }
    
        //
        // Instantiate game
        //
        var game = new Game();
        game.name = req.body.name;
        game.creator = req.user;
        game.map = req.body.map;
        game.activityDate = new Date();

        game.players.push({ user: req.user, country: req.body.country, active: true, funds: 0 });
        
        req.game = game;
    
        //
        // Set the slug, start the turn then save the game 
        //
        setSlug(req).then(utils.saveModel).then(function(game) {
            res.json({ message: 'Game created', game: game });
        })
        .catch(function(err) {
            res.status(400).json({ message: err });
        });
        
    });

router.route('/:gameSlug')

    //
    // Delete a game, must have created the game
    //
    .delete(authorizationChecks.userCreatedGame, function(req, res) {
    
        req.game.remove(function(err, game) {
            if (err) {
                return res.status(400).json({ message: err });
            }
            
            res.json({ message: 'Deleted game' });
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
                    return res.status(400).json({ message: err });
                }
            
                res.json({ game: game });
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
                    return res.status(400).json({ message: err });
                }
                
                res.json({ message: 'Game updated!' });
            });
        
    });
        
router.route('/build/:gameSlug')
    
    //
    // Build a unit
    //
    .put(authorizationChecks.isActivePlayer, function(req, res) {
    
        if (! req.game.startDate) {
            return res.status(400).json({ message: 'Game has not started yet' });
        }
        
        var i = utils.getActivePlayerIndex(req.game);
        if (req.game.players[i].funds < UnitData[req.body.unit.id].cost) {
            return res.status(400).json({ message: 'Insufficient funds' });        
        }
    
        var unit = new Unit();
    
        unit.ammo = req.body.unit.ammo;
        unit.fuel = req.body.unit.fuel;
        unit.id = req.body.unit.id;
        unit.country = req.body.unit.country;
        unit.tile = req.body.tile;
        unit.moved = true;
        
        req.game.activityDate = new Date();
        req.game.units.push(unit);
        req.game.players[i].funds -= UnitData[unit.id].cost;
    
        req.game.save(function(err) {
            if (err) {
                return res.status(400).json({ message: err });
            }
            
            res.json({ message: 'Game updated!' });    
        });
        
    });

router.route('/move/:gameSlug')

    //
    // Move a unit
    //
    .put(authorizationChecks.isActivePlayer, function(req, res) {
        
        if (! req.game.startDate) {
            return res.status(400).json({ message: 'Game has not started yet' });
        }

        var i = req.game.units.map(function(u) { if (u) { return u.tile; } }).indexOf(req.body.fromTile);
    
        if (req.game.units[i].moved) {
            return res.status(400).json({ message: 'Unit already moved this turn or was just built' });
        }
    
        req.game.activityDate = new Date();
        req.game.units[i].tile = req.body.toTile;
        req.game.units[i].fuel -= req.body.cost;
        if (req.game.units[i].fuel < 0) {
            req.game.units[i].fuel = 0;
        }
    
        req.game.save(function(err) {
            if (err) {
                return res.status(400).json({ message: err });
            }
            
            res.json({ message: 'Game updated!' });    
        });
    });

router.route('/start/:gameSlug')

    // 
    // Start the game
    //
    .put(authorizationChecks.isActivePlayer, function(req, res) {
    
        if (req.game.startDate) {
            return res.status(400).json({ message: 'Game already started' });
        }
    
        req.game.activityDate = new Date();
        req.game.startDate = new Date();
        req.game = utils.startTurn(req.game);
        req.game.save(function(err) {
            if (err) {
                return res.status(400).json({ message: 'Error starting game' });
            }
            
            res.json({ message: 'Started game', game: req.game });
        });
    
    });

router.route('/end-turn/:gameSlug')

    // 
    // End current player's turn
    //
    .put(authorizationChecks.isActivePlayer, function(req, res) {
    
    
        if (! req.game.startDate) {
            return res.status(400).json({ message: 'Game has not started yet' });
        }

        var ndx = utils.getActivePlayerIndex(req.game);
        req.game.players[ndx].active = false;
        
        ndx++;
        if (ndx >= req.game.players.length) {
            ndx = 0;
        }
        req.game.players[ndx].active = true;
    
        req.game.activityDate = new Date();
        req.game = utils.startTurn(req.game);
        req.game.save(function(err) {
            if (err) {
                return res.status(400).json({ message: 'Error ending turn' });
            }
            
            res.json({ message: 'Turn ended', game: req.game });
        });
    
    });

module.exports = router;