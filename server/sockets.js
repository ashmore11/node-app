var Chalk  = require('chalk');
var io     = require('socket.io');
var Player = require('./models/player');
var Bullet = require('./models/bullet');

var Sockets = {

  server: null,
  socket: null,

};

Sockets.init = function init(app, server) {

  this.app    = app;
  this.server = io.listen(server);

  this.server.sockets.on('connection', this.connected.bind(this));

};

Sockets.connected = function connected(socket) {

  console.log(Chalk.green('Client Connected'));

  this.socket = socket;

  this.bind();

};

Sockets.bind = function bind() {

  this.socket.on('sceneReady',     this.sceneReady.bind(this));
  this.socket.on('createPlayer',   this.createPlayer.bind(this));
  this.socket.on('createBullet',   this.createBullet.bind(this));
  this.socket.on('updateRotation', this.updateRotation.bind(this));
  this.socket.on('updatePosition', this.updatePosition.bind(this));
  this.socket.on('removeBullet',   this.removeBullet.bind(this));
  this.socket.on('removePlayer',   this.removePlayer.bind(this));
  this.socket.on('increaseHealth', this.increaseHealth.bind(this));
  this.socket.on('decreaseHealth', this.decreaseHealth.bind(this));
  this.socket.on('disconnect',     this.disconnected.bind(this));

};

Sockets.sceneReady = function sceneReady() {

  Player.find({}, (err, players) => {

    this.socket.emit('addPlayers', players);

  });

};

Sockets.createPlayer = function createPlayer(user, callback) {

  console.log(Chalk.green('Create Player'));

  var player = Player({
    id: user.id,
    username: user.name,
    color: user.color,
    position : {
      x: 0,
      y: 0,
    },
    rotation : 0,
    health   : 100,
    createdAt: new Date,
  });

  player.save((err, doc) => {

    if (err) {

      callback(err);

    } else {

      this.socket.emit('playerCreated', doc);

      callback();

    }

  });

};

Sockets.updatePosition = function updatePosition(id, position) {

  Player.update(
    { id: id },
    { $set: { position: position } },
    { upsert: true },
    err => {

      if (!err) this.socket.emit('positionUpdated', id, position);

    }

  );

};

Sockets.updateRotation = function updateRotation(id, rotation) {

  Player.update(
    { id: id },
    { $set: { rotation: rotation } },
    { upsert: true },
    (err, doc) => {

      if (!err) this.socket.emit('rotationUpdated', id, rotation);

    }

  );

};

Sockets.createBullet = function createBullet(params) {

  var bullet = Bullet({
    user: params.user,
    color: params.color,
    position: {
      x: params.x,
      y: params.y,
    },
    direction: {
      x: params.vx,
      y: params.vy,
    },
  });

  bullet.save((err, doc) => {

    if (!err) this.socket.emit('bulletCreated', doc);

  });

};

Sockets.increaseHealth = function increaseHealth(id) {

  Player.update(
    { id: id },
    { $inc: { health: 5 } },
    { upsert: true },
    err => {

      if (!err) this.socket.emit('increaseHealth', id);

    }

  );

};

Sockets.decreaseHealth = function decreaseHealth(id) {

  Player.update(
    { id: id },
    { $inc: { health: -10 } },
    { upsert: true }
  );

};

Sockets.removeBullet = function removeBullet(id) {

  Bullet.find({ _id: id }).remove(err => {

    if (!err) this.socket.emit('bulletDestroyed', id);

  })

};

Sockets.removePlayer = function removePlayer(id) {

  Player.find({ _id: id }).remove(err => {

    if (!err) this.socket.emit('playerDestroyed', id);

  })

};

Sockets.disconnected = function disconnected() {

  console.log(Chalk.red('Client Disconnected'));

};


module.exports = Sockets;
