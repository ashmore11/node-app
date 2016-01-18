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
/***/ function(module, exports) {

	'use strict';

	var App = {

	  socket: null,
	  $sender: $('#sender'),
	  $receiver: $('#receiver')

	};

	App.init = function init() {

	  this.socket = io.connect('http://localhost:3000');

	  this.socket.on('connect', function () {
	    return console.log('socket connected');
	  });

	  this.bind();
	};

	App.bind = function bind() {

	  this.$sender.on('click', this.sendMessage.bind(this));

	  this.socket.on('server_message', this.messageRecieved.bind(this));
	};

	App.sendMessage = function sendMessage() {

	  this.socket.emit('message', 'Message Sent on ' + new Date());
	};

	App.messageRecieved = function messageRecieved(data) {

	  this.$receiver.append('<li>' + data + '</li>');
	};

	App.init();

/***/ }
/******/ ]);