var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var Map             = require('./map');
var User            = require('./user');

var PlayerSchema    = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    country: String,
    active: Boolean
}, { _id: false });

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
    },
    players: [PlayerSchema],
    startDate: Date,
    activityDate: Date,
    endDate: Date,
    units: [Schema.Types.Mixed]
});

module.exports = mongoose.model('Game', GameSchema);