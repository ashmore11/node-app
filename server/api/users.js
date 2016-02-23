var UserModel = require('../models/user');

var UserApi = {

  create: function create(data, res) {

    var user = UserModel({
      fbid: data.fbid,
      name: data.name,
      email: data.email,
      profileImage: data.profileImage,
    });

    user.save(function(err) {

      if (err) res.send(err);

      res.json({ message: 'Successfully created user...' });

    });

  },

  get: function get(id, res) {

    var params = id !== null ? { fbid: id } : {}

    UserModel.find(params, function(err, users) {

      if (err) res.send(err);

      res.json(users);

    });

  },

  update: function update(id, data, res) {

    UserModel.update(
      { fbid: id },
      { $set: data },
      { upsert: true },
      (err, doc) => {

        if (err) res.send(err);

        res.json({ message: 'Successfully updated user...' });

      }

    );

  },

  remove: function remove(id, res) {

    UserModel.remove({ fbid: id }, function(err) {

      if (err) res.send(err);

      res.json({ message: 'Successfully deleted user...' });

    });

  },

};

module.exports = UserApi;
