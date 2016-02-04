var bcrypt      = require('bcrypt');
var express     = require('express');
var router      = express.Router();

var User        = require('../models/user');

router.route('/')

    // Get all users
    .get(function(req, res) {
        
        User.find(function(err, users) {
            if(err)
                res.send(err);
            
            res.json(users);
        });
        
    })

    // Create new user
    .post(function(req, res) {
        
        var user = new User();
        user.username = req.body.username;
        
        var salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(req.body.password, salt);
        
        User.findOne({ username: req.body.username }, function(err, result) {
            if (err)
                res.send(err);
            
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

    // Delete a user
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);
            
            res.json({ message: 'Deleted user' });
        });
    })

    // Get single user
    .get(function(req, res) {
        
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            
            res.json(user);
        });
        
    })

    // Update a user
    .put(function(req, res) {
        
        User.findById(req.params.user_id, function(err, user) {
            
            if (err)
                res.send(err);
            
            user.name = req.body.name;
            
            user.save(function(err) {
                if (err)
                    res.send(err);
                
                res.json({ message: 'User updated!' });
            });
            
        });
        
    });
        

module.exports = router;