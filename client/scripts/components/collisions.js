import User from 'app/components/user';
import Renderer from 'app/components/renderer';
import Stage from 'app/components/stage';

const Collisions = {

  init: function init() {

    Happens(this);

  },

  run: function run(player) {

    Stage.children.forEach(object => {

      if (object.type === 'bullet') {

        const params = {
          object,
          px: player.x,
          py: player.y,
          bx: object.x,
          by: object.y,
        };

        if (object.user !== User.id) {

          this.checkPlayerCollision(params);

        } else {

          this.checkWallCollision(params);

        }

      }

    });

  },

  checkPlayerCollision: function checkPlayerCollision(params) {

    if (params.bx > params.px - 20 &&
        params.bx < params.px + 20 &&
        params.by > params.py - 20 &&
        params.by < params.py + 20) {

      this.playerCollision(params.object);

    }

  },

  checkWallCollision: function checkWallCollision(params) {

    if (params.bx > Renderer.width ||
        params.by > Renderer.height ||
        params.bx < 0 ||
        params.by < 0) {

      this.wallCollision(params.object);

    }

  },

  playerCollision: function playerCollision(object) {

    console.log('--- PLAYER COLLISION ---');

    this.emit('player:hit', object);

  },

  wallCollision: function wallCollision(object) {

    console.log('--- WALL COLLISION ---');

    this.emit('wall:hit', object._id);

  },

};

export default Collisions;
