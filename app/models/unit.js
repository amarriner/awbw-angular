var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var UnitSchema = new Schema({
    ammo: Number,
    fuel: Number,
    id: Number,
    country: String,
    tile: Number,
    moved: Boolean
}, { _id: false });

module.exports = mongoose.model('Unit', UnitSchema);