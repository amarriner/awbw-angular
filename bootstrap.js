var bcrypt      = require('bcrypt-nodejs');
var config      = require('./app/config');

var mongoose    = require('mongoose');
mongoose.connect(config.database);

var terrainData = require('./app/data/terrain-data.json');
var Map         = require('./app/models/map');
var User        = require('./app/models/user');

function createUser() {
    var user = new User();
    user.username = 'amarriner';    
    var salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync('test', salt);
    user.save(function(err) {
        if (err) {
            console.log(err);
            return;
        } 
        
        console.log('User created');
    });
}

function createMap() {
    var tiles = [ 
        {terrain: 0}, {terrain: 0}, {terrain: 0}, {terrain: 0}, {terrain: 0},
        {terrain: 0}, {terrain: 2}, {terrain: 0}, {terrain: 10, country: 'bm'}, {terrain: 0},
        {terrain: 13, country: 'os'}, {terrain: 4}, {terrain: 4}, {terrain: 4}, {terrain: 13, country: 'bm'},
        {terrain: 0}, {terrain: 10, country: 'os'}, {terrain: 0}, {terrain: 2}, {terrain: 0},
        {terrain: 0}, {terrain: 0}, {terrain: 0}, {terrain: 0}, {terrain: 0}
    ];

    map = new Map();
    map.name = 'amarriner Demo';
    map.slug = 'amarriner-demo';
    map.width = 5;
    map.tiles = tiles;
    
    map.save(function(err) {
        if (err) {
            console.log(err);
            return;
        }
    
        console.log('Map saved');
    });
}

User.remove({ username: 'amarriner' }, function(err, user) { createUser(); });
Map.remove({ name: 'amarriner Demo' }, function(err, map) { createMap(); });
