import Stage from 'app/components/stage';

const Bullet = {};

Bullet.create = function create() {

  this.createBody();
  this.createBullet();

};

Bullet.createBody = function createBody() {

  this.body = new PIXI.Graphics();

  this.body.beginFill(`0x${this.color}`, 1);
  this.body.drawCircle(0, 0, 2);

};

Bullet.createBullet = function createBullet() {

  this.bullet = new PIXI.Container();

  this.bullet._id = this._id;
  this.bullet.user = this.user;

  this.bullet.x = this.position.x;
  this.bullet.y = this.position.y;

  this.bullet.type = 'bullet';

  this.bullet.direction = {
    x: this.direction.x,
    y: this.direction.y,
  };

  this.bullet.addChild(this.body);

};

Bullet.remove = function remove(id) {

  Stage.children.forEach(child => {

    if (child._id === id && child.type === 'bullet') {

      child.removeChildren();
      Stage.removeChild(child);

    }

  });

};

Bullet.update = function update() {

  Stage.children.forEach(object => {

    if (object.type === 'bullet') {

      object.x = object.x + object.direction.y;
      object.y = object.y - object.direction.x;

    }

  });

};

export default Bullet;
