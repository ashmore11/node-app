var Http     = require('http');
var Express  = require('express');
var Chalk    = require('chalk');
var Router   = require('./router');
var Sockets  = require('./sockets');
var Mongoose = require('mongoose');
var Player   = require('./models/player');
var Bullet   = require('./models/bullet');

var App = {

  app: Express(),
  port: process.env.PORT || 3000,

  init: function init() {

    Mongoose.connect('mongodb://localhost/node-app');

    this.dumpDB();
    this.configure();
    this.createServer();

    Router.init(this.app);

  },

  configure: function configure() {

    this.app.set('views', process.env.PWD + '/client/templates');
    this.app.set('view engine', 'jade');

    this.app.use(Express.static(process.env.PWD + '/public'));

  },

  createServer: function createServer() {

    var server = Http.createServer(this.app);

    server.listen(this.port, () => {

      console.log(Chalk.cyan('Listening on http://localhost:' + this.port));

      Sockets.init(this.app, server);

    });

  },

  dumpDB: function dumpDB() {

    Player.remove({}, err => {

      if (err) {

        console.log(err);

      } else {

        console.log(Chalk.red('Players dumped'));

      }

    });

    Bullet.remove({}, err => {

      if (err) {

        console.log(err);

      } else {

        console.log(Chalk.red('Bullets dumped'));

      }

    });

  },

};

App.init();
