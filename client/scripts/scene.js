import User from 'app/components/user';
import Stats from 'app/utils/stats';
import Renderer from 'app/components/renderer';
import Stage from 'app/components/stage';
import Controls from 'app/components/controls';
import Player from 'app/components/player';
import Bullet from 'app/components/bullet';
import Collisions from 'app/components/collisions';

const Scene = {

  $el: null,
  socket: null,

  init: function init(socket) {

    this.$el = $('#scene');
    this.socket = socket;

    this.$el.append(Renderer.view);

    Collisions.init();

  },

  start: function start() {

    this.socket.emit('sceneReady');

    Controls.init(this.$el);

    Stats.init(this.$el, 0, 0, 0);

    this.animate();

    this.bind();

  },

  bind: function bind() {

    this.socket.on('addPlayers', this.addPlayers.bind(this));

    this.socket.on('playerCreated', this.addPlayer.bind(this));
    this.socket.on('playerDestroyed', id => Player.remove(id));

    this.socket.on('positionUpdated', this.updatePosition.bind(this));
    this.socket.on('rotationUpdated', this.updateRotation.bind(this));

    this.socket.on('bulletCreated', this.addBullets.bind(this));
    this.socket.on('bulletDestroyed', id => Bullet.remove(id));

    Collisions.on('player:hit', this.playerCollision.bind(this));
    Collisions.on('wall:hit', this.wallCollision.bind(this));

    Controls.on('mousedown', this.createBullet.bind(this));

  },

  addPlayers: function addPlayers(arr) {

    arr.forEach(obj => {

      if (obj.id === User.id) return;

      const newPlayer = Object.assign(Object.create(Player), obj);

      newPlayer.create();

      newPlayer.player.x = newPlayer.position.x;
      newPlayer.player.y = newPlayer.position.y;

      Stage.addChild(newPlayer.player);

    });

  },

  addPlayer: function addPlayer(obj) {

    const newPlayer = Object.assign(Object.create(Player), obj);

    newPlayer.create();

    newPlayer.player.x = Renderer.width / 2;
    newPlayer.player.y = Renderer.height / 2;

    Stage.addChild(newPlayer.player);

  },

  emitPosition: function emitPosition() {

    const pos = Player.getPosition(this.player);

    this.socket.emit('updatePosition', User.id, pos);

  },

  updatePosition: function updatePosition(id, position) {

    console.log(id);

    const player = Stage.getChildById(id);

    player.x = position.x;
    player.y = position.y;

  },

  emitRotation: function emitRotation() {

    const rotation = Controls.getRotation(this.player.x, this.player.y);

    this.socket.emit('updateRotation', User.id, rotation);

  },

  updateRotation: function updateRotation(id, rotation) {

    const player = Stage.getChildById(id);

    player.children.forEach(child => {

      if (child.type === 'cannon') {

        child.rotation = rotation;

      }

    });

  },

  playerCollision: function playerCollision(object) {

    this.socket.emit('decreaseHealth', User.id);

    this.socket.emit('increaseHealth', object.user);

    this.socket.emit('removeBullet', object.id);

  },

  createBullet: function createBullet() {

    const params = Controls.fireBullet(this.player);

    this.socket.emit('createBullet', params);

  },

  addBullets: function addBullets(obj) {

    const newBullet = Object.assign(Object.create(Bullet), obj);

    newBullet.create();

    Stage.addChild(newBullet.bullet);

  },

  wallCollision: function wallCollision(id) {

    this.socket.emit('removeBullet', id);

  },

  updateHealth: function updateHealth() {

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

  },

  removeDeadPlayers: function removeDeadPlayers() {

    if (User.health <= 0) {

      this.socket.emit('removePlayer', User.id);

    }

  },

  update: function update() {

    this.player = Stage.getChildById(User.id);

    if (!this.player) return;

    Collisions.run(this.player);

    this.emitPosition();
    this.emitRotation();

    Bullet.update();

    // this.removeDeadPlayers();

    // this.updateHealth();

  },

  animate: function animate() {

    requestAnimationFrame(this.animate.bind(this));

    Stats.begin();

    Renderer.render(Stage);

    this.update();

    Stats.end();

  },

};

export default Scene;
