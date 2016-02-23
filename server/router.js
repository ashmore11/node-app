var UserApi = require('./api/users');

var Router = {

  init: function init(app) {

    app.get('/api/users', (req, res) => {

      UserApi.get(null, function(err, result) {

        if (err) {

          console.log(err);

        } else {

          console.log(result);

        }

      });

    });

  },

};

module.exports = Router;
