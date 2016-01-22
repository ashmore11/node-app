import randomID from 'random-id';
import User from 'app/components/user';
import Scene from './scene';

const App = {

  socket: null,
  $input: $('input'),
  $form: $('form'),

};

App.init = function init() {

  this.socket = io.connect('http://localhost:3000');

  Scene.init(this.socket);

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

  User.setProps({
    id: randomID(),
    name: event.target.text.value.toUpperCase(),
    color: randomColor({ luminosity: 'light' }).split('#')[1],
  });

  if ($('button').hasClass('disabled')) {

    alert('Your username must be at least 3 characters...');

    return;

  }

  this.socket.emit('createPlayer', User, err => {

    if (!err) {

      TweenMax.to(this.$form, 0.25, { autoAlpha: 0 });

      Scene.start();

    }

  });

};

App.init();
