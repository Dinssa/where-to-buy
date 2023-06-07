const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: String,
    subtitle: String,
    description: String,
    phoneNumber: String,
    operationHours: [Object],
    products: [Object]
  }, {
    timestamps: true
});

module.exports = mongoose.model('Listing', listingSchema);