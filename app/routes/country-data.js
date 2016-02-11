var express     = require('express');
var router      = express.Router();
var fs          = require('fs');

router.route('/').

    //
    // Get all Countries
    //
    get(function(req, res) {
        
        res.json(require('../data/country-data'));
        
    });
        

module.exports = router;