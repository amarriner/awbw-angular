var express     = require('express');
var router      = express.Router();
var fs          = require('fs');

router.route('/').

    //
    // Get all Terrain
    //
    get(function(req, res) {
        
       fs.readFile('./app/data/terrain-data.json', function(err, data) {
           if (err) {
               res.status(404).send(err);
           }
           
           res.json(JSON.parse(data));
       });
        
    });
        

module.exports = router;