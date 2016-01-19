const Scene = {

  $el: $('#scene'),
  user: null,
  socket: null,
  renderer: new PIXI.CanvasRenderer(1500, 1000, { antialias: true }),
  stage: new PIXI.Container(),

};

Scene.setup = function setup(socket) {

  this.socket = socket;

  this.$el.append(this.renderer.view);

};

Scene.init = function init() {

  $(document).on('keydown keyup', this.getKeyEvents.bind(this));
  $(document).on('mousemove', this.getRotateAngle.bind(this));
  $(document).on('mousedown', this.createBullet.bind(this));

  this.createStats();

  this.animate();
  
  this.bind();

};

Scene.bind = function bind() {

  this.socket.on('playerCreated',   this.generatePlayer.bind(this));
  this.socket.on('playerDestroyed', this.removePlayer.bind(this));
  this.socket.on('updatePosition',  this.updatePlayersPosition.bind(this));
  this.socket.on('updateRotation',  this.updatePlayersRotation.bind(this));
  this.socket.on('bulletCreated',   this.addBulletsToStage.bind(this));
  this.socket.on('bulletDestroyed', this.removeBulletsFromStage.bind(this));

};

Scene.createStats = function createStats() {

  this.stats = new Stats();
  this.stats.setMode(0);

  this.stats.domElement.style.position = 'absolute';
  this.stats.domElement.style.left     = '0px';
  this.stats.domElement.style.top      = '0px';

  this.$el.append(this.stats.domElement);

};

Scene.getKeyEvents = function getKeyEvents(event) {

  if(!window.user) return

  event.preventDefault();

  // if(event.type === 'keydown') {

  //   if(event.which === 87) Session.set('move:up', true);
  //   if(event.which === 83) Session.set('move:down', true);
  //   if(event.which === 65) Session.set('move:left', true);
  //   if(event.which === 68) Session.set('move:right', true);

  // } else {

  //   if(event.which === 87) Session.set('move:up', false);
  //   if(event.which === 83) Session.set('move:down', false);
  //   if(event.which === 65) Session.set('move:left', false);
  //   if(event.which === 68) Session.set('move:right', false);

  // }

};

Scene.getRotateAngle = function getRotateAngle( event ) {

  if(!window.user) return;

  const pageX = event.pageX - this.$el.offset().left;
  const pageY = event.pageY - this.$el.offset().top;

  const x = pageX - this.player.x;
  const y = pageY - this.player.y;

  const angle    = Math.atan2(x, -y) * (180 / Math.PI);
  const rotation = angle * Math.PI / 180;

  this.socket.emit('updateRotation', window.user._id, rotation);

};

Scene.removePlayer = function removePlayer(id) {

  const object = this.getObjectFromStage(id);

  object.removeChildren();
  this.stage.removeChild(object);

};

Scene.addCurrentUsers = function addCurrentUsers() {

  // Players.find().fetch().forEach(player => {

  //   const params = {
  //     id     : player._id,
  //     name   : player.username,
  //     color  : player.color,
  //     health : player.health,
  //     x      : player.position.x,
  //     y      : player.position.y,
  //   };

  //   this.generatePlayer(params);

  // });

};

Scene.generatePlayer =  function generatePlayer(params) {

  const circle = new PIXI.Graphics();
  circle.beginFill("0x#{params.color}", 1);
  circle.drawCircle(0, 0, 20);

  const cannon = new PIXI.Graphics();
  cannon.beginFill("0x#{params.color}", 1);
  cannon.drawRect(-2, 5, 6, -30);
  cannon.type = 'cannon';

  const name = new PIXI.Text(params.username, {
    font: '14px Avenir Next Condensed', 
    fill: 'white'
  });
  name.x = -(name.width / 2);
  name.y = -45;

  const health = new PIXI.Text((params.health || 100), {
    font: '14px Avenir Next Condensed', 
    fill: 'black'
  });
  health.x    = -(health.width / 2);
  health.y    = -(health.height / 2);
  health.type = 'health';

  const user = new PIXI.Container();
  user._id  = params._id;
  user.type = 'player';
  user.x    = params.position.x || this.renderer.width / 2;
  user.y    = params.position.y || this.renderer.height / 2;

  user.addChild(circle);
  user.addChild(cannon);
  user.addChild(name);
  user.addChild(health);

  this.stage.addChild(user);

};

Scene.updatePosition = function updatePosition() {

  if(!this.player) return;

  const speed = 7.5;

  let x = this.player.x;
  let y = this.player.y;

  // if(Session.get('move:left')) x -= speed;
  // if(Session.get('move:up')) y -= speed;
  // if(Session.get('move:right')) x += speed;
  // if(Session.get('move:down')) y += speed;

  if(x < 20) x = 20;
  if(y < 20) y = 20;
  
  if(x > this.renderer.width  - 20) x = this.renderer.width  - 20;
  if(y > this.renderer.height - 20) y = this.renderer.height - 20;

  const pos = {
    x: x,
    y: y,
  };

  this.socket.emit('updatePosition', window.user._id, pos);

};

Scene.updatePlayersPosition = function updatePlayersPosition(id, pos) {

  const player = this.getObjectFromStage(id);

  player.x = pos.x;
  player.y = pos.y;

};

Scene.updatePlayersRotation = function updatePlayersRotation(id, rotation) {

  player = this.getObjectFromStage(id);

  player.children.forEach((child) => {

    if(child.type === 'cannon') {

      child.rotation = rotation;

    }

  });

};

Scene.createBullet = function createBullet(event) {

  if(!this.player) return;

  event.preventDefault();

  const pageX = event.pageX - this.$el.offset().left;
  const pageY = event.pageY - this.$el.offset().top;

  const angle   = Math.atan2(pageX - this.player.x, - (pageY - this.player.y)) * (180 / Math.PI);
  const radians = angle * Math.PI / 180;
  const speed   = 1000;

  params = {
    user : window.user._id,
    x    : this.player.x,
    y    : this.player.y,
    vx   : Math.cos(radians) * speed / 60,
    vy   : Math.sin(radians) * speed / 60,
    color: window.user.color,
  };

  this.socket.emit('createBullet', params);

};

Scene.addBulletsToStage = function addBulletsToStage(id, doc) {

  const circle = new PIXI.Graphics();

  circle.beginFill("0x#{doc.color}", 1);
  circle.drawCircle(0, 0, 2);

  bullet      = new PIXI.Container();
  bullet.x    = doc.position.x;
  bullet.y    = doc.position.y;
  bullet._id  = id;
  bullet.user = doc.user;
  bullet.type = 'bullet';

  bullet.direction = {
    x: doc.direction.x,
    y: doc.direction.y,
  };

  bullet.addChild(circle);
  this.stage.addChild(bullet);

};

Scene.removeBulletsFromStage = function removeBulletsFromStage(id) {

  const object = this.getObjectFromStage(id);

  object.removeChildren();
  this.stage.removeChild(object);

};

Scene.updateBullets = function updateBullets() {

  this.stage.children.forEach(object => {

    if(object.type === 'bullet') {

      object.x = object.x + object.direction.y;
      object.y = object.y - object.direction.x;

    }

  });

};

Scene.updatePlayersHealth = function updatePlayersHealth() {

  // this.stage.children.forEach(object => {

  //   if(object.type === 'player') {

  //     const player = Players.findOne({ _id: object._id });

  //     if(!player) return;

  //     object.children.forEach(child => {

  //       if(child.type === 'health') {

  //         child.text = player.health;
  //         child.x    = -(child.width / 2);
  //         child.y    = -(child.height / 2);

  //       }

  //     });

  //   }

  // });

};

Scene.collisionDetection = function collisionDetection() {

  if(!this.player) return;

  const px = this.player.x;
  const py = this.player.y;

  this.stage.children.forEach(object => {

    if(object.type === 'bullet') {

      const ox = object.x;
      const oy = object.y;

      // Dont check for collision if bullet belongs to window.user
      if(object.user !== window.user._id) {

        if(ox > px - 20 && ox < px + 20 && oy > py - 20 && oy < py + 20) {

          // Increase the health of the player who shot the bullet by 5
          this.socket.emit('increaseHealth', object.user);

          // Decrease the health of the player who was shot by 10
          this.socket.emit('decreaseHealth', window.user._id);

          // Remove the bullet from the collection and clients ui
          this.socket.emit('removeBullet', object._id);

        }

      } else {

        // Remove any bullets that leave the clients ui
        if(ox > this.renderer.width || ox < 0 || 
           oy > this.renderer.height || oy < 0) {

            this.socket.emit('removeBullet', object._id);

        }

      }

    }

  });

};

Scene.removeDeadPlayers = function removeDeadPlayers() {

  if(!window.user) return;

  if(window.user.health <= 0) {

    this.socket.emit('removePlayer', window.user._id);

  }

};

Scene.getObjectFromStage =  function getObjectFromStage( id ) {

  return this.stage.children.filter(child => {

    if(child._id === id) return child;

  })[0];

};

Scene.update = function update() {

  this.player = this.getObjectFromStage(window.user._id);

  this.updatePosition();

  this.updateBullets();

  // this.updatePlayersHealth();

  // this.collisionDetection();

  this.removeDeadPlayers();

};

Scene.animate = function animate() {

  requestAnimationFrame(this.animate.bind(this));

  this.stats.begin();

  this.renderer.render(this.stage);

  this.update();

  this.stats.end();

};

export default Scene;