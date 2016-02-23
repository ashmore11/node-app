var UserApi = require('./api/users');
var RaceApi = require('./api/races');

var AppRouter = {

  createUser: function createUser(route) {

    route.post(function(req, res) {

      UserApi.create(req.body, res);

    });

  },

  getUsers: function getUsers(route) {

    route.get(function(req, res) {

      UserApi.get(null, res);

    });

  },

  getUser: function getUser(route) {

    route.get(function(req, res) {

      UserApi.get(req.params.id, res);

    });

  },

  updateUser: function updateUser(route) {

    route.put(function(req, res) {

      UserApi.update(req.params.id, req.body, res);

    });

  },

  removeUser: function removeUser(route) {

    route.delete(function(req, res) {

      UserApi.remove(req.params.id, res);

    });

  },

  createRace: function createRace(route) {

    route.post(function(req, res) {

      RaceApi.create(req.body, res);

    });

  },

  getRaces: function getRaces(route) {

    route.get(function(req, res) {

      RaceApi.get(res);

    });

  },

};

module.exports = AppRouter;
