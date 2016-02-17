var config      = require('../config');
var bcrypt      = require('bcrypt-nodejs');
var express     = require('express');
var jwt         = require('jsonwebtoken');
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
    
        if (! req.body.username) {
            res.status(400).json({ message: 'Missing username' });
            return;
        }
    
        if (! req.body.password) {
            res.status(400).json({ message: 'Missing password' });
            return;
        }
    
        var user = new User();
        user.username = req.body.username;
        
        if (req.body.email) {
            user.email = req.body.email;
        }
        
        var salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(req.body.password, salt);
        
        User.findOne({ username: req.body.username }, function(err, result) {
            if (err) {
                res.status(400).json(err);
            }
            
            if (result) {
                res.status(400).json({ message: 'There is already a user named ' + req.body.username });
            }
            
            else {
                user.save(function(err) {
                    if (err) {
                        res.status(400).json(err);
                        return;
                    }
        
                    res.json({
                        message: 'User Created',
                        user: user, 
                        token: jwt.sign(user, config.secret, {
                            expiresIn: config.tokenExpirationTime
                        })
                    });
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