const Bullet = {

  props: null,
  body: null,
  bullet: null,

};

Bullet.create = function create(props, callback) {

  this.props = props;

  this.createBody();
  this.createBullet();

  callback(this.bullet);

  return Object.create(this, {});

};

Bullet.createBody = function createBody() {

  this.body = new PIXI.Graphics();

  this.body.beginFill(`0x${this.props.color}`, 1);
  this.body.drawCircle(0, 0, 2);

};

Bullet.createBullet = function createBullet() {

  this.bullet = new PIXI.Container();

  this.bullet._id  = this.props._id;
  this.bullet.user = this.props.user;

  this.bullet.x = this.props.position.x;
  this.bullet.y = this.props.position.y;

  this.bullet.type = 'bullet';

  this.bullet.direction = {
    x: this.props.direction.x,
    y: this.props.direction.y,
  };

  this.bullet.addChild(this.body);

};

Bullet.remove = function remove(id, stage) {

  stage.children.forEach(child => {

    if (child._id === id && child.type === 'bullet') {

      child.removeChildren();
      stage.removeChild(child);

    }

  });

};

export default Bullet;