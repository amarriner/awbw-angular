var mustBe      = require('mustBe');
var config      = require('../config');
mustBe.configure(config.mustBeConfig);

var express     = require('express');
var router      = express.Router();

var Game        = require('../models/game');
var User        = require('../models/user');

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
    .post(mustBe.routeHelpers().authenticated(), function(req, res) {
        
        var game = new Game();
        game.name = req.body.name;
        
        User.findById(req.decoded._doc._id, function(err, user) {
            if(err) {
                res.status(404).send(err);
            }
            
            game.creator = user;
            
            game.save(function(err) {
                if (err)
                    res.send(err);
        
                res.json({ message: 'Game Created' });
            });
        });
        
    });

router.route('/:game_id')

    //
    // Delete a game, must be authorized
    //
    .delete(mustBe.routeHelpers().authorized('update.game'), function(req, res) {
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
    .put(mustBe.routeHelpers().authorized('update.game'), function(req, res) {
        
        Game.findById(req.params.game_id, function(err, game) {
            
            if (err)
                res.send(err);
            
            game.name = req.body.name;
            
            game.save(function(err) {
                if (err)
                    res.send(err);
                
                res.json({ message: 'Game updated!' });
            });
            
        });
        
    });
        

module.exports = router;