var jwt         = require('jsonwebtoken');
var _           = require('underscore');
var express     = require('express');
var router      = express.Router();

var config      = require('../config');

router.use(function(req, res, next) {
    
    // Look at the public API routes defined in the config.js file,
    // if this is one of those (including request method) allow acces
    // regardless of token
    if(_.find(config.publicApiRoutes, function(obj) { return (obj.path == req.path && obj.method == req.method); })) {
        next();
        return;
    }
    
    // Attempt to verify JWT if this is not a public API route
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (token) {
        
        jwt.verify(token, config.secret, function(err, decoded) {
            
            // Something went wrong in verification, send 401 status
            if (err) {
                return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
            }
            // Otherwise continue on the route
            else {
                req.decoded = decoded;
                next();
            }
            
        });
    }
    
    // If this was not a public route, and no token was given, send 401 status
    else {
        return res.status(401).send({
            success: false,
            message: 'Missing token'
        });
    }
    
});

module.exports = router;
