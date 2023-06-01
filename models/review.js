const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    listing : {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    helpedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
  }, {
    timestamps: true
  });

module.exports = mongoose.model('Review', reviewSchema);