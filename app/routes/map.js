var config      = require('../config');
var bcrypt      = require('bcrypt-nodejs');
var express     = require('express');
var router      = express.Router();

var Map         = require('../models/map');

var authorizationChecks = require('../libs/authorization-checks');

router.route('/')

    //
    // Get all Maps
    //
    .get(function(req, res) {
        
        Map.find(function(err, maps) {
            if(err) {
                res.status(500).json({ message: err });
                return;
            }
            
            res.json(maps);
        });
        
    })

    //
    // Create new maps
    //
    .post(function(req, res) {
        
        console.log(req);
    
        var map = new Map();
    
        if (! req.body.name) {
            res.status(400).json({ message: 'Missing map name' });
            return;
        }
    
        map.name = req.body.name;
    
        if (! req.body.width) {
            res.status(400).json({ message: 'Missing map width' });
            return;
        }
        
        Map.findOne({ name: req.body.name }, function(err, result) {
            if (err) {
                res.status(500).json({ message: err });
                return;
            }
            
            if (result) {
                res.json({ error: 'There is already a map named ' + req.body.name });
                return;
            }
            
            else {
                map.save(function(err) {
                    if (err) {
                        res.status(500).json({ message: err });
                        return;
                    }
        
                    res.json({ message: 'Map Created' });
                });
            }
        });
        
        
    });

router.route('/:mapSlug')

    //
    // Get single map
    //
    .get(function(req, res) {
        
        Map.findOne({ slug: req.params.mapSlug}, function(err, map) {
            if (err) {
                res.status(404).json({ message: err });
                return;
            }
            
            res.json(map);
        });
        
    })

    //
    // Update a map
    //
    .put(authorizationChecks.userCreatedMap, function(req, res) {
        
        req.map.name = req.body.name;
        req.map.width = req.body.width;
            
        req.map.save(function(err) {
            if (err) {
                res.status(500).json({ message: err });
                return;
            }
                
            res.json({ message: 'Map updated!' });
        });
        
    })

    //
    // Delete a map
    //
    .delete(authorizationChecks.userCreatedMap, function(req, res) {
            
        req.map.remove(function(err) {
            if (err) {
                res.status(500).json({ message: err });
                return;
            }
                
            res.json({ message: 'Map deleted!' });
        });
        
    });

        

module.exports = router;