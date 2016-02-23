import User from 'app/components/user';

const Controls = {

  $el: null,
  up: false,
  down: false,
  left: false,
  right: false,
  x: 0,
  y: 0,

  init: function init(el) {

    Happens(this);

    this.$el = el;

    this.bind();

  },

  bind: function bind() {

    $(document).on('keydown keyup', this.getKeyEvents.bind(this));
    $(document).on('mousemove', this.mousemove.bind(this));
    $(document).on('mousedown', this.mousedown.bind(this));

  },

  getKeyEvents: function getKeyEvents(event) {

    event.preventDefault();

    if (event.type === 'keydown') {

      if (event.which === 87) this.up = true;
      if (event.which === 83) this.down = true;
      if (event.which === 65) this.left = true;
      if (event.which === 68) this.right = true;

    } else {

      if (event.which === 87) this.up = false;
      if (event.which === 83) this.down = false;
      if (event.which === 65) this.left = false;
      if (event.which === 68) this.right = false;

    }

  },

  mousemove: function mousemove(event) {

    this.x = event.pageX;
    this.y = event.pageY;

  },

  mousedown: function mousedown() {

    this.emit('mousedown');

  },

  getRotation: function getRotation(px, py) {

    const pageX = this.x - this.$el.offset().left;
    const pageY = this.y - this.$el.offset().top;

    const x = pageX - px;
    const y = pageY - py;

    const angle = Math.atan2(x, -y) * (180 / Math.PI);
    const rotation = angle * Math.PI / 180;

    return rotation;

  },

  fireBullet: function fire(player) {

    const px = player.x;
    const py = player.y;

    const pageX = this.x - this.$el.offset().left;
    const pageY = this.y - this.$el.offset().top;

    const angle = Math.atan2(pageX - px, - (pageY - py)) * (180 / Math.PI);
    const radians = angle * Math.PI / 180;
    const speed = 1000;

    const params = {
      user: User.id,
      color: User.color,
      x: px,
      y: py,
      vx: Math.cos(radians) * speed / 60,
      vy: Math.sin(radians) * speed / 60,
    };

    return params;

  },

};

export default Controls;
