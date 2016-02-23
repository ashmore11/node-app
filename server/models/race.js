var Mongoose = require('mongoose');

var raceSchema = new Mongoose.Schema({
  startTime: {
    type: Date,
    required: true,
  },
  competitors: {
    type: Array,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  }
});

var Race = Mongoose.model('Race', raceSchema);

module.exports = Race;
