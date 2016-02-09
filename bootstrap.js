var config      = require('./app/config');

var mongoose    = require('mongoose');
mongoose.connect(config.database);

var terrainData = require('./app/data/terrain-data.json');
var Map         = require('./app/models/map');

var tiles = [ {terrain: 0}, {terrain: 0}, {terrain: 0}, {terrain: 0}, {terrain: 0},
 {terrain: 0}, {terrain: 2}, {terrain: 0}, {terrain: 10, country: 'bm'}, {terrain: 0},
 {terrain: 13, country: 'os'}, {terrain: 4}, {terrain: 4}, {terrain: 4}, {terrain: 13, country: 'bm'},
 {terrain: 0}, {terrain: 10, country: 'os'}, {terrain: 0}, {terrain: 2}, {terrain: 0},
 {terrain: 0}, {terrain: 0}, {terrain: 0}, {terrain: 0}, {terrain: 0}];

Map.findById('56ba2e146d4875a31f1d66c6', function(err, map) {
    if (err) {
        console.log(err);
        return;
    }
    
    console.log('Map found');
    map.width = 5;
    map.tiles = tiles;
    
    map.save(function(err) {
        if (err) {
            console.log(err);
            return;
        }
        
        console.log('Map saved');
    })
});