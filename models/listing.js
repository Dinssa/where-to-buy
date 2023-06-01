const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: String,
    description: String,
    phoneNumber: String,
    operationHours: [String],
    products: [Object]
  }, {
    timestamps: true
  });

module.exports = mongoose.model('Listing', listingSchema);