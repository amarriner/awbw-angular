var config      = require('../config');
var express     = require('express');
var router      = express.Router();
var slug        = require('slug');

var Game        = require('../models/game');
var User        = require('../models/user');

var authorizationChecks = require('../libs/authorization-checks');

function generateSlug(name, callback) {
    var gameSlug = slug(name);
    
    Game.count({ slug: new RegExp('^' + gameSlug + '(-([0-9])+)?$') }, function(err, c) {
       
        if (c === 0) {
            return callback(null, gameSlug);
        }
        
        return callback(null, slug(name + '-' + c));
        
    });
}

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
        
        User.findById(req.decoded._doc._id, function(err, user) {
            if(err) {
                res.status(404).send(err);
            }
            
            game.creator = user;
            game.name = req.body.name;
            generateSlug(req.body.name, function(err, s) {
                
                game.slug = s;
                
                game.save(function(err) {
                    if (err)
                        res.send(err);
        
                    res.json({ message: 'Game Created' });
                });
        
            });
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