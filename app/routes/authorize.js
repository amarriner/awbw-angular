var jwt         = require('jsonwebtoken');
var _           = require('underscore');
var express     = require('express');
var router      = express.Router();

var config      = require('../config');

var User        = require('../models/user');

router.use(function(req, res, next) {
    
    //
    // Assume not authenticated
    //
    req.user = { authenticated: false, success: false };
    
    //
    // Get the JWT from the request
    //
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (token) {
        
        //
        // Attempt to verify the incoming token
        //
        jwt.verify(token, config.secret, function(err, decoded) {
            
            //
            // Something went wrong in verification, send 401 status
            //
            if (err) {
                req.message = 'Failed to authenticate token';
                next();
            }
            
            //
            // Otherwise continue on the route
            //
            else {
                
                //
                // Find the authenticated User
                //
                User.findOne({ username: decoded._doc.username }, function(err, user) {
                    if (err) { 
                        req.message = 'Failed to look up user';
                        next();
                    }
                
                    if (! user) {
                        req.message = 'No such user ' + decoded._doc.username;
                        next();
                    }
                    //
                    // Add the user and the decoded token to the request object
                    //
                    user.authenticated = true;
                    req.user = user;
                    req.decoded = decoded;
                    next(); 
                });
            }
            
        });
    }
    
    //
    // No token was supplied
    //
    else {
        req.message = 'Missing token';
        next();
    }
    
});

module.exports = router;
