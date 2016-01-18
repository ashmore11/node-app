var App = {

  socket: null,
  $sender: $('#sender'),
  $receiver: $('#receiver'),

};

App.init = function init() {

  this.socket = io.connect('http://localhost:3000');

  this.socket.on('connect', () => console.log('socket connected'));

  this.bind();

};

App.bind = function bind() {

  this.$sender.on('click', this.sendMessage.bind(this));

  this.socket.on('server_message', this.messageRecieved.bind(this));

};

App.sendMessage = function sendMessage() {
  
  this.socket.emit('message', 'Message Sent on ' + new Date());     
  
};

App.messageRecieved = function messageRecieved(data) {

  this.$receiver.append('<li>' + data + '</li>');

};

App.init();