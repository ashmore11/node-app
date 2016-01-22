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

	var _randomId = __webpack_require__(1);

	var _randomId2 = _interopRequireDefault(_randomId);

	var _scene = __webpack_require__(2);

	var _scene2 = _interopRequireDefault(_scene);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var App = {

	  socket: null,
	  $input: $('input'),
	  $form: $('form')

	};

	App.init = function init() {

	  this.socket = io.connect('http://localhost:3000');

	  this.socket.on('connect', function (something) {

	    console.log('socket connected', something);
	  });

	  _scene2.default.init(this.socket);

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

	  event.preventDefault();

	  var name = event.target.text.value.toUpperCase();
	  var color = randomColor({ luminosity: 'light' }).split('#')[1];

	  if ($('button').hasClass('disabled')) {

	    alert('Your username must be at least 3 characters...');

	    return;
	  }

	  window.User = {
	    id: (0, _randomId2.default)(),
	    name: name,
	    color: color
	  };

	  this.socket.emit('createPlayer', window.User.id, name, color);

	  TweenMax.to(this.$form, 0.25, { autoAlpha: 0 });

	  _scene2.default.start();
	};

	App.init();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	(function(){
		var randomID = function(len,pattern){
			var possibilities = ["abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789", "~!@#$%^&()_+-={}[];\',"];
			var chars = "";

			var pattern = pattern ? pattern : "aA0";
			pattern.split('').forEach(function(a){
				if(!isNaN(parseInt(a))){
					chars += possibilities[2];
				}else if(/[a-z]/.test(a)){
					chars += possibilities[0];
				}else if(/[A-Z]/.test(a)){
					chars += possibilities[1];
				}else{
					chars += possibilities[3];
				}
			});
			
			var len = len ? len : 30;

			var result = '';

			while(len--){ 
				result += chars.charAt(Math.floor(Math.random() * chars.length)); 
			};

			return result;
		};

		if(true){
			module.exports = randomID;
		} else {
			window["randomID"] = randomID;
		};

	})();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _stats = __webpack_require__(3);

	var _stats2 = _interopRequireDefault(_stats);

	var _renderer = __webpack_require__(4);

	var _renderer2 = _interopRequireDefault(_renderer);

	var _stage = __webpack_require__(5);

	var _stage2 = _interopRequireDefault(_stage);

	var _controls = __webpack_require__(6);

	var _controls2 = _interopRequireDefault(_controls);

	var _player = __webpack_require__(7);

	var _player2 = _interopRequireDefault(_player);

	var _bullet = __webpack_require__(8);

	var _bullet2 = _interopRequireDefault(_bullet);

	var _collisions = __webpack_require__(9);

	var _collisions2 = _interopRequireDefault(_collisions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Scene = {

	  $el: $('#scene'),
	  socket: null

	};

	Scene.init = function init(socket) {

	  this.socket = socket;

	  this.$el.append(_renderer2.default.view);

	  _collisions2.default.init();
	};

	Scene.start = function start() {

	  this.socket.emit('sceneReady');

	  _controls2.default.init(this.$el);

	  _stats2.default.init(this.$el, 0, 0, 0);

	  this.animate();

	  this.bind();
	};

	Scene.bind = function bind() {

	  this.socket.on('addPlayers', this.addPlayers.bind(this));

	  this.socket.on('playerCreated', this.addPlayer.bind(this));
	  this.socket.on('playerDestroyed', function (id) {
	    return _player2.default.remove(id);
	  });

	  this.socket.on('positionUpdated', this.updatePosition.bind(this));
	  this.socket.on('rotationUpdated', this.updateRotation.bind(this));

	  this.socket.on('bulletCreated', this.addBullets.bind(this));
	  this.socket.on('bulletDestroyed', function (id) {
	    return _bullet2.default.remove(id);
	  });

	  _controls2.default.on('mousedown', this.createBullet.bind(this));

	  _collisions2.default.on('player:hit', this.playerCollision.bind(this));
	  _collisions2.default.on('wall:hit', this.wallCollision.bind(this));
	};

	Scene.addPlayers = function addPlayers(arr) {

	  arr.forEach(function (obj) {

	    if (obj.id === window.User.id) return;

	    var newPlayer = Object.assign(Object.create(_player2.default), obj);

	    newPlayer.create();

	    newPlayer.player.x = newPlayer.position.x;
	    newPlayer.player.y = newPlayer.position.y;

	    _stage2.default.addChild(newPlayer.player);
	  });
	};

	Scene.addPlayer = function addPlayer(obj) {

	  console.log(obj);

	  var newPlayer = Object.assign(Object.create(_player2.default), obj);

	  newPlayer.create();

	  newPlayer.player.x = _renderer2.default.width / 2;
	  newPlayer.player.y = _renderer2.default.height / 2;

	  _stage2.default.addChild(newPlayer.player);
	};

	Scene.emitPosition = function emitPosition() {

	  var pos = _player2.default.getPosition(this.player);

	  this.socket.emit('updatePosition', window.User.id, pos);
	};

	Scene.updatePosition = function updatePosition(id, position) {

	  var player = _stage2.default.getChildById(id);

	  player.x = position.x;
	  player.y = position.y;
	};

	Scene.emitRotation = function emitRotation() {

	  var rotation = _controls2.default.getRotation(this.player.x, this.player.y);

	  this.socket.emit('updateRotation', window.User.id, rotation);
	};

	Scene.updateRotation = function updateRotation(id, rotation) {

	  var player = _stage2.default.getChildById(id);

	  player.children.forEach(function (child) {

	    if (child.type === 'cannon') {

	      child.rotation = rotation;
	    }
	  });
	};

	Scene.playerCollision = function playerCollision(object) {

	  this.socket.emit('decreaseHealth', window.user.id);

	  this.socket.emit('increaseHealth', object.user);

	  this.socket.emit('removeBullet', object.id);
	};

	Scene.createBullet = function createBullet() {

	  var params = _controls2.default.fireBullet(this.player);

	  this.socket.emit('createBullet', params);
	};

	Scene.addBullets = function addBullets(obj) {

	  var newBullet = Object.assign(Object.create(_bullet2.default), obj);

	  newBullet.create();

	  _stage2.default.addChild(newBullet.bullet);
	};

	Scene.wallCollision = function wallCollision(id) {

	  this.socket.emit('removeBullet', id);
	};

	Scene.updateHealth = function updateHealth() {

	  _stage2.default.children.forEach(function (object) {

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

	Scene.removeDeadPlayers = function removeDeadPlayers() {

	  if (window.UserHealth <= 0) {

	    this.socket.emit('removePlayer', window.User.id);
	  }
	};

	Scene.update = function update() {

	  this.player = _stage2.default.getChildById(window.User.id);

	  if (!this.player) return;

	  _collisions2.default.run(this.player);

	  this.emitPosition();
	  this.emitRotation();

	  _bullet2.default.update();

	  // this.removeDeadPlayers();

	  // this.updateHealth();
	};

	Scene.animate = function animate() {

	  requestAnimationFrame(this.animate.bind(this));

	  _stats2.default.begin();

	  _renderer2.default.render(_stage2.default);

	  this.update();

	  _stats2.default.end();
	};

	exports.default = Scene;

/***/ },
/* 3 */
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
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var width = 1500;
	var height = 1000;

	var options = {
	  antialias: true
	};

	var Renderer = new PIXI.CanvasRenderer(width, height, options);

	exports.default = Renderer;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Stage = new PIXI.Container();

	Stage.getChildById = function getChildById(id) {

	  return Stage.children.filter(function (child) {

	    if (child.id === id) return child;
	  })[0];
	};

	exports.default = Stage;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Controls = {

	  $el: null,
	  up: false,
	  down: false,
	  left: false,
	  right: false,
	  x: 0,
	  y: 0

	};

	Controls.init = function init(el) {

	  Happens(this);

	  this.$el = el;

	  this.bind();
	};

	Controls.bind = function bind() {

	  $(document).on('keydown keyup', this.getKeyEvents.bind(this));
	  $(document).on('mousemove', this.mousemove.bind(this));
	  $(document).on('mousedown', this.mousedown.bind(this));
	};

	Controls.getKeyEvents = function getKeyEvents(event) {

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

	Controls.mousemove = function mousemove(event) {

	  this.x = event.pageX;
	  this.y = event.pageY;
	};

	Controls.mousedown = function mousedown() {

	  this.emit('mousedown');
	};

	Controls.getRotation = function getRotation(px, py) {

	  var pageX = this.x - this.$el.offset().left;
	  var pageY = this.y - this.$el.offset().top;

	  var x = pageX - px;
	  var y = pageY - py;

	  var angle = Math.atan2(x, -y) * (180 / Math.PI);
	  var rotation = angle * Math.PI / 180;

	  return rotation;
	};

	Controls.fireBullet = function fire(player) {

	  var px = player.x;
	  var py = player.y;

	  var pageX = this.x - this.$el.offset().left;
	  var pageY = this.y - this.$el.offset().top;

	  var angle = Math.atan2(pageX - px, -(pageY - py)) * (180 / Math.PI);
	  var radians = angle * Math.PI / 180;
	  var speed = 1000;

	  var params = {
	    user: window.User.id,
	    color: window.User.color,
	    x: px,
	    y: py,
	    vx: Math.cos(radians) * speed / 60,
	    vy: Math.sin(radians) * speed / 60
	  };

	  return params;
	};

	exports.default = Controls;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _renderer = __webpack_require__(4);

	var _renderer2 = _interopRequireDefault(_renderer);

	var _stage = __webpack_require__(5);

	var _stage2 = _interopRequireDefault(_stage);

	var _controls = __webpack_require__(6);

	var _controls2 = _interopRequireDefault(_controls);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Player = {};

	Player.create = function create() {

	  this.createBody();
	  this.createCannon();
	  this.createName();
	  this.createHealth();
	  this.createPlayer();
	};

	Player.createBody = function createBody() {

	  this.body = new PIXI.Graphics();

	  this.body.beginFill('0x' + this.color, 1);
	  this.body.drawCircle(0, 0, 20);
	};

	Player.createCannon = function createCannon() {

	  this.cannon = new PIXI.Graphics();

	  this.cannon.beginFill('0x' + this.color, 1);
	  this.cannon.drawRect(-2, 5, 6, -30);

	  this.cannon.type = 'cannon';
	};

	Player.createName = function createName() {

	  this.name = new PIXI.Text(this.username, {
	    font: '14px Avenir Next Condensed',
	    fill: 'white'
	  });

	  this.name.x = -(this.name.width / 2);
	  this.name.y = -45;
	};

	Player.createHealth = function createHealth() {

	  this.health = new PIXI.Text(this.health || 100, {
	    font: '14px Avenir Next Condensed',
	    fill: 'black'
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

	  var speed = 7;

	  var x = player.x;
	  var y = player.y;

	  if (_controls2.default.up) y -= speed;
	  if (_controls2.default.down) y += speed;
	  if (_controls2.default.left) x -= speed;
	  if (_controls2.default.right) x += speed;

	  if (x < 20) x = 20;
	  if (y < 20) y = 20;

	  if (x > _renderer2.default.width - 20) x = _renderer2.default.width - 20;
	  if (y > _renderer2.default.height - 20) y = _renderer2.default.height - 20;

	  return { x: x, y: y };
	};

	Player.remove = function remove(id) {

	  _stage2.default.children.forEach(function (child) {

	    if (child.id === id && child.type === 'player') {

	      child.removeChildren();
	      _stage2.default.removeChild(child);
	    }
	  });
	};

	exports.default = Player;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _stage = __webpack_require__(5);

	var _stage2 = _interopRequireDefault(_stage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Bullet = {};

	Bullet.create = function create() {

	  this.createBody();
	  this.createBullet();
	};

	Bullet.createBody = function createBody() {

	  this.body = new PIXI.Graphics();

	  this.body.beginFill('0x' + this.color, 1);
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
	    y: this.direction.y
	  };

	  this.bullet.addChild(this.body);
	};

	Bullet.remove = function remove(id) {

	  _stage2.default.children.forEach(function (child) {

	    if (child._id === id && child.type === 'bullet') {

	      child.removeChildren();
	      _stage2.default.removeChild(child);
	    }
	  });
	};

	Bullet.update = function update() {

	  _stage2.default.children.forEach(function (object) {

	    if (object.type === 'bullet') {

	      object.x = object.x + object.direction.y;
	      object.y = object.y - object.direction.x;
	    }
	  });
	};

	exports.default = Bullet;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _renderer = __webpack_require__(4);

	var _renderer2 = _interopRequireDefault(_renderer);

	var _stage = __webpack_require__(5);

	var _stage2 = _interopRequireDefault(_stage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Collisions = {};

	Collisions.init = function init() {

	  Happens(this);
	};

	Collisions.run = function run(player) {
	  var _this = this;

	  _stage2.default.children.forEach(function (object) {

	    if (object.type === 'bullet') {

	      var params = {
	        object: object,
	        px: player.x,
	        py: player.y,
	        bx: object.x,
	        by: object.y
	      };

	      if (object.user !== window.User.id) {

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

	  if (params.bx > _renderer2.default.width || params.by > _renderer2.default.height || params.bx < 0 || params.by < 0) {

	    this.wallCollision(params.object);
	  }
	};

	Collisions.playerCollision = function playerCollision(object) {

	  console.log('--- PLAYER COLLISION ---');

	  this.emit('player:hit', object);
	};

	Collisions.wallCollision = function wallCollision(object) {

	  console.log('--- WALL COLLISION ---');

	  this.emit('wall:hit', object._id);
	};

	exports.default = Collisions;

/***/ }
/******/ ]);