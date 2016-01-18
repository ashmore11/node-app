var io    = require('socket.io');
var chalk = require('chalk');

var Sockets = {

  server: null,
  socket: null,

};

Sockets.init = function init(server) {
  
  this.server = io.listen(server);

  this.server.sockets.on('connection', this.connected.bind(this));

};

Sockets.connected = function connected(socket) {

  console.log(chalk.green('Client Connected:', socket.id));

  this.socket = socket;

  this.socket.on('message', this.messageRecieved.bind(this));

  this.socket.on('disconnect', this.disconnected.bind(this));

};

Sockets.disconnected = function disconnected(data, test) {

  console.log(chalk.red('Client Disconnected.'));

};

Sockets.messageRecieved = function messageRecieved(data) {

  this.socket.broadcast.emit('server_message', data);

  this.socket.emit('server_message', data);

};

module.exports = Sockets;