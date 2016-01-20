import Stats      from 'app/utils/stats';
import Controls   from 'app/components/controls';
import Player     from 'app/components/player';
import Bullet     from 'app/components/bullet';
import Position   from 'app/components/position';
import Collisions from 'app/components/collisions';

export default function Scene(socket) {

  this.$el      = $('#scene'),
  this.renderer = new PIXI.CanvasRenderer(1500, 1000, { antialias: true }),
  this.stage    = new PIXI.Container(),
  this.socket   = socket;

  this.$el.append(this.renderer.view);

};

Scene.prototype.init = function init() {

  this.controls = new Controls(this.$el);

  Stats.init(this.$el, 0, 0, 0);

  this.animate();
  
  this.bind();

};

Scene.prototype.bind = function bind() {

  $(document).on('mousedown', this.createBullet.bind(this));

  this.socket.on('addPlayers',      this.addPlayers.bind(this));
  this.socket.on('playerDestroyed', this.removePlayers.bind(this));
  this.socket.on('updatePosition',  this.updateAllPositions.bind(this));
  this.socket.on('updateRotation',  this.updateRotation.bind(this));
  this.socket.on('bulletCreated',   this.addBullets.bind(this));
  this.socket.on('bulletDestroyed', this.removeBullets.bind(this));

};

Scene.prototype.addPlayers = function addPlayers(arr) {

  arr.forEach(obj => {

    const pos = {
      x: this.renderer.width / 2,
      y: this.renderer.height / 2,
    };

    const newPlayer = Player.create(obj, pos, player => {

      this.stage.addChild(player);

    });

  });

};

Scene.prototype.removePlayers = function removePlayers(id) {

  Player.remove(id, stage);

};

Scene.prototype.updatePosition = function updatePosition() {

  const pos = Position(this.player, this.controls, this.renderer);

  this.socket.emit('updatePosition', window.User._id, pos);

};

Scene.prototype.updateAllPositions = function updateAllPositions(id, pos) {

  const player = this.getObjectFromStage(id);

  player.x = pos.x;
  player.y = pos.y;

};

Scene.prototype.updateRotation = function updateRotation(id, rotation) {

  const player = this.getObjectFromStage(id);

  player.children.forEach((child) => {

    if(child.type === 'cannon') {

      child.rotation = rotation;

    }

  });

};

Scene.prototype.createBullet = function createBullet(event) {

  event.preventDefault();

  const params = this.controls.fire(event.pageX, event.pageY, this.player);

  this.socket.emit('createBullet', params);

};

Scene.prototype.addBullets = function addBullets(doc) {

  const newBullet = Bullet.create(doc, bullet => {

    this.stage.addChild(bullet);

  });

};

Scene.prototype.removeBullets = function removeBullets(id) {

  Bullet.remove(id, stage);

};

Scene.prototype.updateBullets = function updateBullets() {

  this.stage.children.forEach(object => {

    if(object.type === 'bullet') {

      object.x = object.x + object.direction.y;
      object.y = object.y - object.direction.x;

    }

  });

};

Scene.prototype.updateHealth = function updateHealth() {

  this.stage.children.forEach(object => {

    if(object.type === 'player') {

      object.children.forEach(child => {

        if(child.type === 'health') {

          child.text = child.health;

          child.x = -(child.width / 2);
          child.y = -(child.height / 2);

        }

      });

    }

  });

};

Scene.prototype.removeDeadPlayers = function removeDeadPlayers() {

  if(window.User.health <= 0) {

    this.socket.emit('removePlayer', window.User._id);

  }

};

Scene.prototype.getObjectFromStage = function getObjectFromStage(id) {

  return this.stage.children.filter(child => {

    if(child._id === id) return child;

  })[0];

};

Scene.prototype.update = function update() {

  this.player = this.getObjectFromStage(window.User._id);

  if(!this.player) return;

  const rotation = this.controls.getRotation(this.player.x, this.player.y);

  this.socket.emit('updateRotation', window.User._id, rotation);

  this.updatePosition();

  this.updateBullets();

  // this.updateHealth();

  Collisions.run(this.player, this.stage, this.renderer, this.socket)

  this.removeDeadPlayers();

};

Scene.prototype.animate = function animate() {

  requestAnimationFrame(this.animate.bind(this));

  Stats.begin();

  this.renderer.render(this.stage);

  this.update();

  Stats.end();

};