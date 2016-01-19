var Mongoose = require('mongoose');

var bulletSchema = new Mongoose.Schema({
  user : String,
  color: String,
  position: {
    x: Number,
    y: Number,
  },
  direction: {
    x: Number,
    y: Number,
  },
});

var Bullet = Mongoose.model('Bullet', bulletSchema);

module.exports = Bullet;