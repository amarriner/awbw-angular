var bcrypt      = require('bcrypt-nodejs');
var jwt         = require('jsonwebtoken');
var express     = require('express');
var router      = express.Router();

var config      = require('../config');
var User        = require('../models/user');

router.route('/')

    //
    // Only allow authentication by POST method
    //
    .post(function(req, res) {
      
        //
        // Find the user with the incoming username
        //
        User.findOne({ username: req.body.username }, function(err, user) {
            if (err) {
                res.status(401).json({ success: false, message: err });
            }
             
            //
            // If we found the user...
            //
            if (user) {
                  
                //
                // Check for missing password
                //
                if (! req.body.password) {
                    res.status(401).json({ message: 'Missing password', success: false });
                    return;
                }
                
                //
                // Compare the encrypted password in the database to
                // the incoming one
                //
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    
                    //
                    // Generate a JWT
                    //
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 60 * 60 * 24 * 7
                    });
                    
                    //
                    // Return it as JSON
                    //
                    res.json({ success: true, message: 'Authenticated successfully', token: token, user: user });
                    
                }
                else {
                    res.status(401).json({ success: false, message: 'Invalid password' });
                }
                
            }
            else {
                res.status(401).json({ success: false, message: 'Invalid username' });
            }
        });
        
    });

module.exports = router;
