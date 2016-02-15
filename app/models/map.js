var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var User            = require('./user');

var TileSchema = new Schema({
    terrain: Number,
    country: String
}, { _id: false });

var MapSchema = new Schema({
    name: String,
    slug: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tiles: [TileSchema],
    width: Number
});

module.exports = mongoose.model('Map', MapSchema);