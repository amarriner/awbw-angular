var express     = require('express');
var router      = express.Router();
var fs          = require('fs');

router.route('/').

    //
    // Get all COs
    //
    get(function(req, res) {
        
       res.json(require('../data/co-data'));
        
    });
        

module.exports = router;