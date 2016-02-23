var UserModel = require('../models/user');

var Api = {

  get: function get(id, callback) {

    var params = id !== null ? { id: id } : {}

    UserModel.find(params, function(err, result) {

      if (err) {

        callback(err, null);

      } else {

        callback(null, result);

      }

    });

  },

  create: function create() {


  }

};

module.exports = Api;
