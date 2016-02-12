var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var Map             = require('./map');
var User            = require('./user');

var GameSchema      = new Schema({
    name: String,
    slug: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    map: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Map'
    }
});

module.exports = mongoose.model('Game', GameSchema);