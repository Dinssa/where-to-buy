const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    googleId: {
      type: String
    },
    email: { 
      type: String,
      required: true,
      unique: true
    },
    password: String,
    avatar: String,
    bookmarks: [{
      type: Schema.Types.ObjectId,
      ref: 'Listing'
    }]
  }, {
    timestamps: true
});

userSchema.methods.validPassword = function(password) {
  return password === this.password; // TODO: implement hashed passwords, including editing seed.js
}

module.exports = mongoose.model('User', userSchema);