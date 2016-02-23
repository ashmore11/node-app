var Mongoose = require('mongoose');

var userSchema = new Mongoose.Schema({
  fbid: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  profileImage: {
    type: String,
    unique: true,
    required: true,
  },
});

var User = Mongoose.model('User', userSchema);

module.exports = User;
