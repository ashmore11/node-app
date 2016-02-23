var RaceModel = require('../models/race');

var RaceApi = {

  create: function create(data, res) {

    var race = RaceModel({
      startTime: data.startTime,
      competitors: data.competitors,
      distance: data.distance,
    });

    console.log(race);

    race.save(function(err) {

      if (err) res.send(err);

      res.json({ message: 'Successfully created race...' });

    });

  },

  get: function get(res) {

    RaceModel.find(function(err, races) {

      if (err) res.send(err);

      res.json(races);

    });

  },

};

module.exports = RaceApi;
