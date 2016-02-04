var bcrypt      = require('bcrypt');
var jwt         = require('jsonwebtoken');
var express     = require('express');
var router      = express.Router();

var config      = require('../config');
var User        = require('../models/user');

router.route('/')

    .post(function(req, res) {
        
        User.findOne({ username: req.body.username }, function(err, user) {
            if (err) 
                res.send(err);
                
            if (user) {
                
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 60 * 60 * 24 * 7
                    });
                    
                    res.json({ success: true, message: 'Authenticated successfully', token: token });
                }
                else {
                    res.json({ success: false, message: 'Invalid password' });
                }
                
            }
            else {
                res.json({ success: false, message: 'Invalid username' });
            }
        });
        
    });

module.exports = router;
