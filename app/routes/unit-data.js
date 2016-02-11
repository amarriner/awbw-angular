var express     = require('express');
var router      = express.Router();
var fs          = require('fs');

router.route('/').

    //
    // Get all Units
    //
    get(function(req, res) {
        
        res.json(require('../data/unit-data'));
        
    });
        

module.exports = router;