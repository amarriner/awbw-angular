var jwt         = require('jsonwebtoken');
var _           = require('underscore');
var express     = require('express');
var router      = express.Router();

var config      = require('../config');

var User        = require('../models/user');

router.use(function(req, res, next) {
    
    req.user = { authenticated: false, success: false };
    
    // Attempt to verify JWT if this is not a public API route
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (token) {
        
        jwt.verify(token, config.secret, function(err, decoded) {
            
            // Something went wrong in verification, send 401 status
            if (err) {
                req.message = 'Failed to authenticate token';
                next();
            }
            
            // Otherwise continue on the route
            else {
                User.findOne({ username: decoded._doc.username }, function(err, user) {
                    if (err) { 
                        req.message = 'Failed to look up user';
                        next();
                    }
                
                    user.authenticated = true;
                    req.user = user;
                    req.decoded = decoded;
                    next(); 
                });
            }
            
        });
    }
    
    // If this was not a public route, and no token was given, send 401 status
    else {
        req.message = 'Missing token';
        next();
    }
    
});

module.exports = router;
