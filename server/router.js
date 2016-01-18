var Router = {

  init: function init(app) {

    app.get('/', (req, res) => {

      res.render('home', { title: 'Node App - Home' });

    });

    app.get('*', (req, res) => {

      res.render('404', { title: 'Node App - 404' });

    });

  },

};

module.exports = Router;