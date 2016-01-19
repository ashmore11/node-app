/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _scene = __webpack_require__(1);

	var _scene2 = _interopRequireDefault(_scene);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var App = {

	  socket: null,
	  $input: $('input'),
	  $form: $('form')

	};

	App.init = function init() {
	  var _this = this;

	  this.socket = io.connect('http://localhost:3000');

	  this.socket.on('connect', function () {

	    _scene2.default.setup(_this.socket);

	    console.log('socket connected');
	  });

	  this.bind();
	};

	App.bind = function bind() {

	  this.$input.on('keyup', this.checkInput.bind(this));
	  this.$form.on('submit', this.submitForm.bind(this));
	};

	App.checkInput = function checkInput() {

	  if ($('input').val().length >= 3) {

	    $('button').removeClass('disabled');
	  } else {

	    $('button').addClass('disabled');
	  }
	};

	App.submitForm = function submitForm(event) {
	  var _this2 = this;

	  event.preventDefault();

	  var name = event.target.text.value.toUpperCase();
	  var color = randomColor({ luminosity: 'light' }).split('#')[1];

	  if ($('button').hasClass('disabled')) {

	    alert('Your username must be at least 3 characters...');

	    return;
	  }

	  this.socket.emit('createPlayer', name, color, function (err, doc) {

	    if (err) {

	      alert('Username already exists, try again...');
	    } else {

	      window.user = doc;

	      TweenMax.to(_this2.$form, 0.25, { autoAlpha: 0 });

	      _scene2.default.init(_this2.socket);
	    }
	  });
	};

	App.init();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Scene = {

	  $el: $('#scene'),
	  user: null,
	  socket: null,
	  renderer: new PIXI.CanvasRenderer(1500, 1000, { antialias: true }),
	  stage: new PIXI.Container()

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

	  this.socket.on('playerCreated', this.generatePlayer.bind(this));
	  this.socket.on('playerDestroyed', this.removePlayer.bind(this));
	  this.socket.on('updatePosition', this.updatePlayersPosition.bind(this));
	  this.socket.on('updateRotation', this.updatePlayersRotation.bind(this));
	  this.socket.on('bulletCreated', this.addBulletsToStage.bind(this));
	  this.socket.on('bulletDestroyed', this.removeBulletsFromStage.bind(this));
	};

	Scene.createStats = function createStats() {

	  this.stats = new Stats();
	  this.stats.setMode(0);

	  this.stats.domElement.style.position = 'absolute';
	  this.stats.domElement.style.left = '0px';
	  this.stats.domElement.style.top = '0px';

	  this.$el.append(this.stats.domElement);
	};

	Scene.getKeyEvents = function getKeyEvents(event) {

	  if (!window.user) return;

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

	Scene.getRotateAngle = function getRotateAngle(event) {

	  if (!window.user) return;

	  var pageX = event.pageX - this.$el.offset().left;
	  var pageY = event.pageY - this.$el.offset().top;

	  var x = pageX - this.player.x;
	  var y = pageY - this.player.y;

	  var angle = Math.atan2(x, -y) * (180 / Math.PI);
	  var rotation = angle * Math.PI / 180;

	  this.socket.emit('updateRotation', window.user._id, rotation);
	};

	Scene.removePlayer = function removePlayer(id) {

	  var object = this.getObjectFromStage(id);

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

	Scene.generatePlayer = function generatePlayer(params) {

	  var circle = new PIXI.Graphics();
	  circle.beginFill("0x#{params.color}", 1);
	  circle.drawCircle(0, 0, 20);

	  var cannon = new PIXI.Graphics();
	  cannon.beginFill("0x#{params.color}", 1);
	  cannon.drawRect(-2, 5, 6, -30);
	  cannon.type = 'cannon';

	  var name = new PIXI.Text(params.username, {
	    font: '14px Avenir Next Condensed',
	    fill: 'white'
	  });
	  name.x = -(name.width / 2);
	  name.y = -45;

	  var health = new PIXI.Text(params.health || 100, {
	    font: '14px Avenir Next Condensed',
	    fill: 'black'
	  });
	  health.x = -(health.width / 2);
	  health.y = -(health.height / 2);
	  health.type = 'health';

	  var user = new PIXI.Container();
	  user._id = params._id;
	  user.type = 'player';
	  user.x = params.position.x || this.renderer.width / 2;
	  user.y = params.position.y || this.renderer.height / 2;

	  user.addChild(circle);
	  user.addChild(cannon);
	  user.addChild(name);
	  user.addChild(health);

	  this.stage.addChild(user);
	};

	Scene.updatePosition = function updatePosition() {

	  if (!this.player) return;

	  var speed = 7.5;

	  var x = this.player.x;
	  var y = this.player.y;

	  // if(Session.get('move:left')) x -= speed;
	  // if(Session.get('move:up')) y -= speed;
	  // if(Session.get('move:right')) x += speed;
	  // if(Session.get('move:down')) y += speed;

	  if (x < 20) x = 20;
	  if (y < 20) y = 20;

	  if (x > this.renderer.width - 20) x = this.renderer.width - 20;
	  if (y > this.renderer.height - 20) y = this.renderer.height - 20;

	  var pos = {
	    x: x,
	    y: y
	  };

	  this.socket.emit('updatePosition', window.user._id, pos);
	};

	Scene.updatePlayersPosition = function updatePlayersPosition(id, pos) {

	  var player = this.getObjectFromStage(id);

	  player.x = pos.x;
	  player.y = pos.y;
	};

	Scene.updatePlayersRotation = function updatePlayersRotation(id, rotation) {

	  player = this.getObjectFromStage(id);

	  player.children.forEach(function (child) {

	    if (child.type === 'cannon') {

	      child.rotation = rotation;
	    }
	  });
	};

	Scene.createBullet = function createBullet(event) {

	  if (!this.player) return;

	  event.preventDefault();

	  var pageX = event.pageX - this.$el.offset().left;
	  var pageY = event.pageY - this.$el.offset().top;

	  var angle = Math.atan2(pageX - this.player.x, -(pageY - this.player.y)) * (180 / Math.PI);
	  var radians = angle * Math.PI / 180;
	  var speed = 1000;

	  params = {
	    user: window.user._id,
	    x: this.player.x,
	    y: this.player.y,
	    vx: Math.cos(radians) * speed / 60,
	    vy: Math.sin(radians) * speed / 60,
	    color: window.user.color
	  };

	  this.socket.emit('createBullet', params);
	};

	Scene.addBulletsToStage = function addBulletsToStage(id, doc) {

	  var circle = new PIXI.Graphics();

	  circle.beginFill("0x#{doc.color}", 1);
	  circle.drawCircle(0, 0, 2);

	  bullet = new PIXI.Container();
	  bullet.x = doc.position.x;
	  bullet.y = doc.position.y;
	  bullet._id = id;
	  bullet.user = doc.user;
	  bullet.type = 'bullet';

	  bullet.direction = {
	    x: doc.direction.x,
	    y: doc.direction.y
	  };

	  bullet.addChild(circle);
	  this.stage.addChild(bullet);
	};

	Scene.removeBulletsFromStage = function removeBulletsFromStage(id) {

	  var object = this.getObjectFromStage(id);

	  object.removeChildren();
	  this.stage.removeChild(object);
	};

	Scene.updateBullets = function updateBullets() {

	  this.stage.children.forEach(function (object) {

	    if (object.type === 'bullet') {

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
	  var _this = this;

	  if (!this.player) return;

	  var px = this.player.x;
	  var py = this.player.y;

	  this.stage.children.forEach(function (object) {

	    if (object.type === 'bullet') {

	      var ox = object.x;
	      var oy = object.y;

	      // Dont check for collision if bullet belongs to window.user
	      if (object.user !== window.user._id) {

	        if (ox > px - 20 && ox < px + 20 && oy > py - 20 && oy < py + 20) {

	          // Increase the health of the player who shot the bullet by 5
	          _this.socket.emit('increaseHealth', object.user);

	          // Decrease the health of the player who was shot by 10
	          _this.socket.emit('decreaseHealth', window.user._id);

	          // Remove the bullet from the collection and clients ui
	          _this.socket.emit('removeBullet', object._id);
	        }
	      } else {

	        // Remove any bullets that leave the clients ui
	        if (ox > _this.renderer.width || ox < 0 || oy > _this.renderer.height || oy < 0) {

	          _this.socket.emit('removeBullet', object._id);
	        }
	      }
	    }
	  });
	};

	Scene.removeDeadPlayers = function removeDeadPlayers() {

	  if (!window.user) return;

	  if (window.user.health <= 0) {

	    this.socket.emit('removePlayer', window.user._id);
	  }
	};

	Scene.getObjectFromStage = function getObjectFromStage(id) {

	  return this.stage.children.filter(function (child) {

	    if (child._id === id) return child;
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

	exports.default = Scene;

/***/ }
/******/ ]);