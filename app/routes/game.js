var express     = require('express');
var router      = express.Router();

var Game        = require('../models/game');
var User        = require('../models/user');

router.route('/')

    // Get all games
    .get(function(req, res) {
        
        Game.find().populate('creator').exec(function(err, games) {
            if(err)
                res.send(err);
            
            res.json(games);
        });
        
    })

    // Create new game
    .post(function(req, res) {
        
        var game = new Game();
        game.name = req.body.name;
        
        User.findById(req.decoded._doc._id, function(err, user) {
            if(err)
                res.send(err);
            
            game.creator = user;
            game.save(function(err) {
                if (err)
                    res.send(err);
        
                res.json({ message: 'Game Created' });
            });
        });
        
    });

router.route('/:game_id')

    // Delete a game
    .delete(function(req, res) {
        Game.remove({
            _id: req.params.game_id
        }, function(err, game) {
            if (err)
                res.send(err);
            
            res.json({ message: 'Deleted game' });
        });
    })

    // Get single game
    .get(function(req, res) {
        
        Game.findById(req.params.game_id, function(err, game) {
            if (err)
                res.send(err);
            
            res.json(game);
        });
        
    })

    // Update a game
    .put(function(req, res) {
        
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