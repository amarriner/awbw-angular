var config      = require('../config');
var bcrypt      = require('bcrypt-nodejs');
var express     = require('express');
var router      = express.Router();

var User        = require('../models/user');

var authorizationChecks = require('../libs/authorization-checks');

router.route('/')

    //
    // Get all users
    //
    .get(function(req, res) {
        
        User.find(function(err, users) {
            if(err) {
                res.status(500).send(err);
            }
            
            res.json(users);
        });
        
    })

    //
    // Create new user
    //
    .post(function(req, res) {
        
        var user = new User();
        user.username = req.body.username;
        
        var salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(req.body.password, salt);
        
        User.findOne({ username: req.body.username }, function(err, result) {
            if (err) {
                res.status(404).send(err);
            }
            
            if (result) {
                res.json({ error: 'There is already a user named ' + req.body.username });
            }
            
            else {
                user.save(function(err) {
                    if (err)
                        res.send(err);
        
                    res.json({ message: 'User Created' });
                });
            }
        });
        
        
    });

router.route('/:user_id')

    //
    // Get single user
    //
    .get(function(req, res) {
        
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            
            res.json(user);
        });
        
    })

    //
    // Update a user
    //
    .put(authorizationChecks.userIsAuthenticatedUser, function(req, res) {
        
        User.findById(req.params.user_id, function(err, user) {
            
            if (err)
                res.send(err);
            
            user.username = req.body.username;
            user.email = req.body.email;
            
            user.save(function(err) {
                if (err)
                    res.send(err);
                
                res.json({ message: 'User updated!' });
            });
            
        });
        
    });
        

module.exports = router;