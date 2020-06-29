const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = require('./user').schema;
const dishSchema = require('./dishes').schema;

const favoriteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    dishes:[{type: Schema.Types.ObjectId, ref: 'Dishes'}]
}, {
    timestamps: true
});


var Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;