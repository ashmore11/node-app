/**
 *  @fileoverview - Module for creating players and adding them to the stage.
 *
 *  @Param - renderer - PIXI WebGL/Canvas Renderer.
 *  @Param - stage    - PIXI Container.
 *  @Param - props    - Player properties.
 */
 const Player = {

  pos    : null,
  props  : null,
  body   : null,
  cannon : null,
  name   : null,
  health : null,
  player : null,

 };

Player.create = function create(props, pos, callback) {

  this.pos   = pos;
  this.props = props;

  this.createBody();
  this.createCannon();
  this.createName();
  this.createHealth();
  this.createPlayer();

  callback(this.player);

  return Object.create(this, {});

};

Player.createBody = function createBody() {

  this.body = new PIXI.Graphics();

  this.body.beginFill(`0x${this.props.color}`, 1);
  this.body.drawCircle(0, 0, 20);

};

Player.createCannon = function createCannon() {

  this.cannon = new PIXI.Graphics();

  this.cannon.beginFill(`0x${this.props.color}`, 1);
  this.cannon.drawRect(-2, 5, 6, -30);

  this.cannon.type = 'cannon';
  
};

Player.createName = function createName() {

  this.name = new PIXI.Text(this.props.username, {
    font: '14px Avenir Next Condensed', 
    fill: 'white'
  });

  this.name.x = -(this.name.width / 2);
  this.name.y = -45;
  
};

Player.createHealth = function createHealth() {

  this.health = new PIXI.Text((this.props.health || 100), {
    font: '14px Avenir Next Condensed', 
    fill: 'black'
  });

  this.health.x = -(this.health.width / 2);
  this.health.y = -(this.health.height / 2);

  this.health.type = 'health';
  
};

Player.createPlayer = function createPlayer() {

  this.player = new PIXI.Container();

  this.player._id = this.props._id;

  this.player.x = this.props.position.x || this.pos.x;
  this.player.y = this.props.position.y || this.pos.y;

  this.player.type = 'player';

  this.player.addChild(this.body);
  this.player.addChild(this.cannon);
  this.player.addChild(this.name);
  this.player.addChild(this.health);
  
};

Player.remove = function remove(id, stage) {

  stage.children.forEach(child => {

    if(child._id === id && child.type === 'player') {

      child.removeChildren();
      stage.removeChild(child);

    }

  });

};

export default Player;