var express     = require('express');
var router      = express.Router();
var fs          = require('fs');

router.route('/').

    //
    // Get all Terrain
    //
    get(function(req, res) {
        
        res.json(require('../data/terrain-data'));
        
    });
        

module.exports = router;