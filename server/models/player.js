var Mongoose = require('mongoose');

var playerSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  position : {
    x: Number,
    y: Number,
  },
  rotation : Number,
  color    : String,
  health   : Number,
  createdAt: Date,
});

var Player = Mongoose.model('Player', playerSchema);

module.exports = Player;