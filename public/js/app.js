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

	    _this.scene = new _scene2.default(_this.socket);

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

	      window.User = doc;

	      TweenMax.to(_this2.$form, 0.25, { autoAlpha: 0 });

	      _this2.scene.init();
	    }
	  });
	};

	App.init();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Scene;

	var _stats = __webpack_require__(2);

	var _stats2 = _interopRequireDefault(_stats);

	var _controls = __webpack_require__(3);

	var _controls2 = _interopRequireDefault(_controls);

	var _player = __webpack_require__(4);

	var _player2 = _interopRequireDefault(_player);

	var _bullet = __webpack_require__(5);

	var _bullet2 = _interopRequireDefault(_bullet);

	var _position = __webpack_require__(6);

	var _position2 = _interopRequireDefault(_position);

	var _collisions = __webpack_require__(7);

	var _collisions2 = _interopRequireDefault(_collisions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Scene(socket) {

	  this.$el = $('#scene'), this.renderer = new PIXI.CanvasRenderer(1500, 1000, { antialias: true }), this.stage = new PIXI.Container(), this.socket = socket;

	  this.$el.append(this.renderer.view);
	};

	Scene.prototype.init = function init() {

	  this.controls = new _controls2.default(this.$el);

	  _stats2.default.init(this.$el, 0, 0, 0);

	  this.animate();

	  this.bind();
	};

	Scene.prototype.bind = function bind() {

	  $(document).on('mousedown', this.createBullet.bind(this));

	  this.socket.on('addPlayers', this.addPlayers.bind(this));
	  this.socket.on('playerDestroyed', this.removePlayers.bind(this));
	  this.socket.on('updatePosition', this.updateAllPositions.bind(this));
	  this.socket.on('updateRotation', this.updateRotation.bind(this));
	  this.socket.on('bulletCreated', this.addBullets.bind(this));
	  this.socket.on('bulletDestroyed', this.removeBullets.bind(this));
	};

	Scene.prototype.addPlayers = function addPlayers(arr) {
	  var _this = this;

	  arr.forEach(function (obj) {

	    var pos = {
	      x: _this.renderer.width / 2,
	      y: _this.renderer.height / 2
	    };

	    var newPlayer = _player2.default.create(obj, pos, function (player) {

	      _this.stage.addChild(player);
	    });
	  });
	};

	Scene.prototype.removePlayers = function removePlayers(id) {

	  _player2.default.remove(id, stage);
	};

	Scene.prototype.updatePosition = function updatePosition() {

	  var pos = (0, _position2.default)(this.player, this.controls, this.renderer);

	  this.socket.emit('updatePosition', window.User._id, pos);
	};

	Scene.prototype.updateAllPositions = function updateAllPositions(id, pos) {

	  var player = this.getObjectFromStage(id);

	  player.x = pos.x;
	  player.y = pos.y;
	};

	Scene.prototype.updateRotation = function updateRotation(id, rotation) {

	  var player = this.getObjectFromStage(id);

	  player.children.forEach(function (child) {

	    if (child.type === 'cannon') {

	      child.rotation = rotation;
	    }
	  });
	};

	Scene.prototype.createBullet = function createBullet(event) {

	  event.preventDefault();

	  var params = this.controls.fire(event.pageX, event.pageY, this.player);

	  this.socket.emit('createBullet', params);
	};

	Scene.prototype.addBullets = function addBullets(doc) {
	  var _this2 = this;

	  var newBullet = _bullet2.default.create(doc, function (bullet) {

	    _this2.stage.addChild(bullet);
	  });
	};

	Scene.prototype.removeBullets = function removeBullets(id) {

	  _bullet2.default.remove(id, stage);
	};

	Scene.prototype.updateBullets = function updateBullets() {

	  this.stage.children.forEach(function (object) {

	    if (object.type === 'bullet') {

	      object.x = object.x + object.direction.y;
	      object.y = object.y - object.direction.x;
	    }
	  });
	};

	Scene.prototype.updateHealth = function updateHealth() {

	  this.stage.children.forEach(function (object) {

	    if (object.type === 'player') {

	      object.children.forEach(function (child) {

	        if (child.type === 'health') {

	          child.text = child.health;

	          child.x = -(child.width / 2);
	          child.y = -(child.height / 2);
	        }
	      });
	    }
	  });
	};

	Scene.prototype.removeDeadPlayers = function removeDeadPlayers() {

	  if (window.User.health <= 0) {

	    this.socket.emit('removePlayer', window.User._id);
	  }
	};

	Scene.prototype.getObjectFromStage = function getObjectFromStage(id) {

	  return this.stage.children.filter(function (child) {

	    if (child._id === id) return child;
	  })[0];
	};

	Scene.prototype.update = function update() {

	  this.player = this.getObjectFromStage(window.User._id);

	  if (!this.player) return;

	  var rotation = this.controls.getRotation(this.player.x, this.player.y);

	  this.socket.emit('updateRotation', window.User._id, rotation);

	  this.updatePosition();

	  this.updateBullets();

	  // this.updateHealth();

	  _collisions2.default.run(this.player, this.stage, this.renderer, this.socket);

	  this.removeDeadPlayers();
	};

	Scene.prototype.animate = function animate() {

	  requestAnimationFrame(this.animate.bind(this));

	  _stats2.default.begin();

	  this.renderer.render(this.stage);

	  this.update();

	  _stats2.default.end();
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var STATS = {

	  stats: new Stats()

	};

	STATS.init = function init(el, mode, top, left) {

	  this.setMode(0 || mode);

	  this.setPosition(0 || top, 0 || left);

	  var $el = el || $(document);

	  $el.append(this.stats.domElement);
	};

	STATS.setMode = function setMode(mode) {

	  this.stats.setMode(mode);
	};

	STATS.setPosition = function setPosition(top, left) {

	  this.stats.domElement.style.position = 'absolute';
	  this.stats.domElement.style.left = left + 'px';
	  this.stats.domElement.style.top = top + 'px';
	};

	STATS.begin = function begin() {

	  this.stats.begin();
	};

	STATS.end = function end() {

	  this.stats.end();
	};

	exports.default = STATS;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Controls;
	function Controls(el) {

	  this.$el = el;
	  this.up = false;
	  this.down = false;
	  this.left = false;
	  this.right = false;
	  this.x = 0;
	  this.y = 0;

	  this.bind();
	};

	Controls.prototype.bind = function bind() {

	  $(document).on('keydown keyup', this.getKeyEvents.bind(this));
	  $(document).on('mousemove', this.getPointerPos.bind(this));
	};

	Controls.prototype.getKeyEvents = function getKeyEvents(event) {

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
	};

	Controls.prototype.getPointerPos = function getPointerPos(event) {

	  this.x = event.pageX;
	  this.y = event.pageY;
	};

	Controls.prototype.getRotation = function getRotation(px, py) {

	  var pageX = this.x - this.$el.offset().left;
	  var pageY = this.y - this.$el.offset().top;

	  var x = pageX - px;
	  var y = pageY - py;

	  var angle = Math.atan2(x, -y) * (180 / Math.PI);
	  var rotation = angle * Math.PI / 180;

	  return rotation;
	};

	Controls.prototype.fire = function fire(x, y, player) {

	  var px = player.x;
	  var py = player.y;

	  var pageX = x - this.$el.offset().left;
	  var pageY = y - this.$el.offset().top;

	  var angle = Math.atan2(pageX - px, -(pageY - py)) * (180 / Math.PI);
	  var radians = angle * Math.PI / 180;
	  var speed = 1000;

	  var params = {
	    user: window.User._id,
	    color: window.User.color,
	    x: px,
	    y: py,
	    vx: Math.cos(radians) * speed / 60,
	    vy: Math.sin(radians) * speed / 60
	  };

	  return params;
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 *  @fileoverview - Module for creating players and adding them to the stage.
	 *
	 *  @Param - renderer - PIXI WebGL/Canvas Renderer.
	 *  @Param - stage    - PIXI Container.
	 *  @Param - props    - Player properties.
	 */
	var Player = {

	  pos: null,
	  props: null,
	  body: null,
	  cannon: null,
	  name: null,
	  health: null,
	  player: null

	};

	Player.create = function create(props, pos, callback) {

	  this.pos = pos;
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

	  this.body.beginFill('0x' + this.props.color, 1);
	  this.body.drawCircle(0, 0, 20);
	};

	Player.createCannon = function createCannon() {

	  this.cannon = new PIXI.Graphics();

	  this.cannon.beginFill('0x' + this.props.color, 1);
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

	  this.health = new PIXI.Text(this.props.health || 100, {
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

	  stage.children.forEach(function (child) {

	    if (child._id === id && child.type === 'player') {

	      child.removeChildren();
	      stage.removeChild(child);
	    }
	  });
	};

	exports.default = Player;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Bullet = {

	  props: null,
	  body: null,
	  bullet: null

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

	  this.body.beginFill('0x' + this.props.color, 1);
	  this.body.drawCircle(0, 0, 2);
	};

	Bullet.createBullet = function createBullet() {

	  this.bullet = new PIXI.Container();

	  this.bullet._id = this.props._id;
	  this.bullet.user = this.props.user;

	  this.bullet.x = this.props.position.x;
	  this.bullet.y = this.props.position.y;

	  this.bullet.type = 'bullet';

	  this.bullet.direction = {
	    x: this.props.direction.x,
	    y: this.props.direction.y
	  };

	  this.bullet.addChild(this.body);
	};

	Bullet.remove = function remove(id, stage) {

	  stage.children.forEach(function (child) {

	    if (child._id === id && child.type === 'bullet') {

	      child.removeChildren();
	      stage.removeChild(child);
	    }
	  });
	};

	exports.default = Bullet;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Position;
	function Position(player, controls, renderer) {

	  var speed = 7.5;

	  var x = player.x;
	  var y = player.y;

	  if (controls.left) x -= speed;
	  if (controls.up) y -= speed;
	  if (controls.right) x += speed;
	  if (controls.down) y += speed;

	  if (x < 20) x = 20;
	  if (y < 20) y = 20;

	  if (x > renderer.width - 20) x = renderer.width - 20;
	  if (y > renderer.height - 20) y = renderer.height - 20;

	  var pos = {
	    x: x,
	    y: y
	  };

	  return pos;
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Collisions = {

	  player: null,
	  stage: null,
	  renderer: null,
	  socket: null

	};

	Collisions.run = function run(player, stage, renderer, socket) {
	  var _this = this;

	  this.renderer = renderer;
	  this.socket = socket;

	  stage.children.forEach(function (object) {

	    if (object.type === 'bullet') {

	      var params = {
	        object: object,
	        px: player.x,
	        py: player.y,
	        bx: object.x,
	        by: object.y
	      };

	      if (object.user !== window.User._id) {

	        _this.checkPlayerCollision(params);
	      } else {

	        _this.checkWallCollision(params);
	      }
	    }
	  });
	};

	Collisions.checkPlayerCollision = function checkPlayerCollision(params) {

	  if (params.bx > params.px - 20 && params.bx < params.px + 20 && params.by > params.py - 20 && params.by < params.py + 20) {

	    this.playerCollision(params.object);
	  }
	};

	Collisions.checkWallCollision = function checkWallCollision(params) {

	  if (params.bx > this.renderer.width || params.by > this.renderer.height || params.bx < 0 || params.by < 0) {

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

	exports.default = Collisions;

/***/ }
/******/ ]);