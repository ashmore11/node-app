var Mongoose = require('mongoose');

var playerSchema = new Mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  position : {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  rotation: { type: Number, required: true },
  color: { type: String, required: true },
  health: { type: Number, required: true },
});

var Player = Mongoose.model('Player', playerSchema);

module.exports = Player;
