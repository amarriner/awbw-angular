var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var Map             = require('./map');
var User            = require('./user');
var Unit            = require('./unit');

var PlayerSchema    = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    country: String,
    active: Boolean,
    funds: Number
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
    units: [Unit.schema]
});

module.exports = mongoose.model('Game', GameSchema);