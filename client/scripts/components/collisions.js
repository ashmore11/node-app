const Collisions = {

  player: null,
  stage: null,
  renderer: null,
  socket: null,

};

Collisions.run = function run(player, stage, renderer, socket) {

  this.renderer = renderer;
  this.socket   = socket;

  stage.children.forEach(object => {

    if(object.type === 'bullet') {

      const params = {
        object: object,
        px: player.x, 
        py: player.y, 
        bx: object.x, 
        by: object.y,
      };

      if(object.user !== window.User._id) {

        this.checkPlayerCollision(params);

      } else {

        this.checkWallCollision(params);

      }

    }

  });

};

Collisions.checkPlayerCollision = function checkPlayerCollision(params) {
  
  if(params.bx > params.px - 20 && 
     params.bx < params.px + 20 && 
     params.by > params.py - 20 && 
     params.by < params.py + 20) {

      this.playerCollision(params.object);

  }

};

Collisions.checkWallCollision = function checkWallCollision(params) {

  if(params.bx > this.renderer.width  || 
     params.by > this.renderer.height || 
     params.bx < 0 || 
     params.by < 0) {

      this.wallCollision(params.object);

  }

};

Collisions.playerCollision = function playerCollision(object) {

  console.log('--- PLAYER COLLISION ---');

  this.socket.emit('decreaseHealth', window.user._id);

  this.socket.emit('increaseHealth', object.user);

  this.socket.emit('removeBullet', object._id);

};

Collisions.wallCollision = function wallCollision(object) {

  console.log('--- WALL COLLISION ---');

  this.socket.emit('removeBullet', object._id);

};

export default Collisions;