var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var User            = require('./user');

var MapSchema      = new Schema({
    name: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tiles: [{
        terrain: String
    }],
    width: Number
});

module.exports = mongoose.model('Map', MapSchema);