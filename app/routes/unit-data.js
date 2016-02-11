var express     = require('express');
var router      = express.Router();
var fs          = require('fs');

router.route('/').

    //
    // Get all Units
    //
    get(function(req, res) {
        
        var units = require('../data/unit-data');
        for (var i = 0; i < units.length; i++) {
            units[i].id = i;
            units[i].filename = units[i].name.replace(' ', '').replace('-', '').replace('.', '').toLowerCase();
        }
    
        res.json(units);
        
    });
        

module.exports = router;