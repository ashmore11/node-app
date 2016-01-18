var http    = require('http');
var express = require('express');
var chalk   = require('chalk');
var router  = require('./router');
var sockets = require('./sockets');

var App = {

  app: express(),
  port: process.env.PORT || 3000,

};

App.init = function init() {

  this.configure();
  this.createServer();

  router.init(this.app);

};

App.configure = function configure() {

  this.app.set('views', process.env.PWD + '/client/templates');
  this.app.set('view engine', 'jade');

  this.app.use(express.static(process.env.PWD + '/public'));

};

App.createServer = function createServer() {

  server = http.createServer(this.app);
  
  server.listen(this.port, () => {
  
    console.log(chalk.cyan('Listening on http://localhost:' + this.port));

    sockets.init(server);
  
  });

};

App.init();