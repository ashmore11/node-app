import Renderer from 'app/components/renderer';
import Stage from 'app/components/stage';
import Controls from 'app/components/controls';

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

  this.player.id = this.id;

  this.player.type = 'player';

  this.player.addChild(this.body);
  this.player.addChild(this.cannon);
  this.player.addChild(this.name);
  this.player.addChild(this.health);

};

Player.getPosition = function getPosition(player) {

  const speed = 7;

  let x = player.x;
  let y = player.y;

  if (Controls.up) y -= speed;
  if (Controls.down) y += speed;
  if (Controls.left) x -= speed;
  if (Controls.right) x += speed;

  if (x < 20) x = 20;
  if (y < 20) y = 20;

  if (x > Renderer.width - 20) x = Renderer.width - 20;
  if (y > Renderer.height - 20) y = Renderer.height - 20;

  return { x, y };

};

Player.remove = function remove(id) {

  Stage.children.forEach(child => {

    if (child.id === id && child.type === 'player') {

      child.removeChildren();
      Stage.removeChild(child);

    }

  });

};

export default Player;
