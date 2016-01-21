import Stage from 'app/components/stage';

const Player = {};

Player.create = function create() {

  this.createBody();
  this.createCannon();
  this.createName();
  this.createHealth();
  this.createPlayer();

};

Player.createBody = function createBody() {

  this.body = new PIXI.Graphics();

  this.body.beginFill(`0x${this.color}`, 1);
  this.body.drawCircle(0, 0, 20);

};

Player.createCannon = function createCannon() {

  this.cannon = new PIXI.Graphics();

  this.cannon.beginFill(`0x${this.color}`, 1);
  this.cannon.drawRect(-2, 5, 6, -30);

  this.cannon.type = 'cannon';

};

Player.createName = function createName() {

  this.name = new PIXI.Text(this.username, {
    font: '14px Avenir Next Condensed',
    fill: 'white',
  });

  this.name.x = -(this.name.width / 2);
  this.name.y = -45;

};

Player.createHealth = function createHealth() {

  this.health = new PIXI.Text((this.health || 100), {
    font: '14px Avenir Next Condensed',
    fill: 'black',
  });

  this.health.x = -(this.health.width / 2);
  this.health.y = -(this.health.height / 2);

  this.health.type = 'health';

};

Player.createPlayer = function createPlayer() {

  this.player = new PIXI.Container();

  this.player._id = this._id;

  this.player.type = 'player';

  this.player.addChild(this.body);
  this.player.addChild(this.cannon);
  this.player.addChild(this.name);
  this.player.addChild(this.health);

};

Player.remove = function remove(id) {

  Stage.children.forEach(child => {

    if (child._id === id && child.type === 'player') {

      child.removeChildren();
      Stage.removeChild(child);

    }

  });

};

export default Player;
