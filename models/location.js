const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    listing : {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    address: String,
    latitude: Number,
    longitude: Number
  }, {
    timestamps: true
  });

module.exports = mongoose.model('Location', locationSchema);