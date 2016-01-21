import Stats from 'app/utils/stats';
import Renderer from 'app/components/renderer';
import Stage from 'app/components/stage';
import Controls from 'app/components/controls';
import Player from 'app/components/player';
import Bullet from 'app/components/bullet';
import Position from 'app/components/position';
import Collisions from 'app/components/collisions';

const Scene = {

  $el: $('#scene'),
  socket: null,

};

Scene.init = function init(socket) {

  this.socket = socket;

  this.$el.append(Renderer.view);

  Collisions.init();

};

Scene.start = function start() {

  this.socket.emit('sceneReady');

  Controls.init(this.$el);

  Stats.init(this.$el, 0, 0, 0);

  this.animate();

  this.bind();

};

Scene.bind = function bind() {

  Controls.on('mousedown', this.createBullet.bind(this));

  this.socket.on('addPlayers', this.addPlayers.bind(this));

  this.socket.on('playerCreated', this.addPlayer.bind(this));
  this.socket.on('playerDestroyed', id => Player.remove(id));

  this.socket.on('updatePosition', this.updateAllPositions.bind(this));
  this.socket.on('updateRotation', this.updateRotation.bind(this));

  this.socket.on('bulletCreated', this.addBullets.bind(this));
  this.socket.on('bulletDestroyed', id => Bullet.remove(id));

  Collisions.on('player:hit', this.playerCollision.bind(this));
  Collisions.on('wall:hit', this.wallCollision.bind(this));

};

Scene.addPlayers = function addPlayers(arr) {

  arr.forEach(obj => {

    const newPlayer = Object.assign(Object.create(Player), obj);

    newPlayer.create();

    const x = newPlayer.position.x || Renderer.width / 2;
    const y = newPlayer.position.y || Renderer.height / 2;

    newPlayer.player.x = x;
    newPlayer.player.y = y;

    Stage.addChild(newPlayer.player);

  });

};

Scene.addPlayer = function addPlayer(obj) {

  const newPlayer = Object.assign(Object.create(Player), obj);

  newPlayer.create();

  newPlayer.player.x = Renderer.width / 2;
  newPlayer.player.y = Renderer.height / 2;

  Stage.addChild(newPlayer.player);

};

Scene.updatePosition = function updatePosition() {

  const pos = Position(this.player);

  this.socket.emit('updatePosition', window.User._id, pos);

};

Scene.updateAllPositions = function updateAllPositions(id, pos) {

  const player = Stage.getObjectById(id);

  player.x = pos.x;
  player.y = pos.y;

};

Scene.updateRotation = function updateRotation(id, rotation) {

  const player = Stage.getObjectById(id);

  player.children.forEach((child) => {

    if (child.type === 'cannon') {

      child.rotation = rotation;

    }

  });

};

Scene.playerCollision = function playerCollision(object) {

  this.socket.emit('decreaseHealth', window.user._id);

  this.socket.emit('increaseHealth', object.user);

  this.socket.emit('removeBullet', object._id);

};

Scene.createBullet = function createBullet() {

  const params = Controls.fireBullet(this.player);

  this.socket.emit('createBullet', params);

};

Scene.addBullets = function addBullets(obj) {

  const newBullet = Object.assign(Object.create(Bullet), obj);

  newBullet.create();

  Stage.addChild(newBullet.bullet);

};

Scene.wallCollision = function wallCollision(id) {

  this.socket.emit('removeBullet', id);

};

Scene.updateHealth = function updateHealth() {

  Stage.children.forEach(object => {

    if (object.type === 'player') {

      object.children.forEach(child => {

        if (child.type === 'health') {

          child.text = child.health;

          child.x = -(child.width / 2);
          child.y = -(child.height / 2);

        }

      });

    }

  });

};

Scene.removeDeadPlayers = function removeDeadPlayers() {

  if (window.User.health <= 0) {

    this.socket.emit('removePlayer', window.User._id);

  }

};

Scene.update = function update() {

  this.player = Stage.getObjectById(window.User._id);

  if (!this.player) return;

  const rotation = Controls.getRotation(this.player.x, this.player.y);

  this.socket.emit('updateRotation', window.User._id, rotation);

  this.updatePosition();

  Bullet.update();

  // this.updateHealth();

  Collisions.run(this.player, Stage, Renderer, this.socket);

  this.removeDeadPlayers();

};

Scene.animate = function animate() {

  requestAnimationFrame(this.animate.bind(this));

  Stats.begin();

  Renderer.render(Stage);

  this.update();

  Stats.end();

};

export default Scene;
