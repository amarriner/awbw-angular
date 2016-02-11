var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var User            = require('./user');

var GameSchema      = new Schema({
    name: String,
    slug: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Game', GameSchema);