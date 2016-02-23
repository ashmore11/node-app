var Router = {

  init: function init(app) {

    app.get('/', (req, res) => {

      var locals = {};

      res.render('home', locals);

    });

  },

};

module.exports = Router;
