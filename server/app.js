var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var AppRouter  = require('./router');

var app  = express();
var port = process.env.PORT || 3000;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://ashmore11:13-cheese-ass@ds015398.mongolab.com:15398/real_time_running');

// Routes for our api
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {

  // make sure we go to the next routes and don't stop here
  next();

});

AppRouter.createUser(router.route('/users'));
AppRouter.getUsers(router.route('/users'));
AppRouter.getUser(router.route('/users/:id'));
AppRouter.updateUser(router.route('/users/:id'));
AppRouter.removeUser(router.route('/users/:id'));
AppRouter.createRace(router.route('/races'));
AppRouter.getRaces(router.route('/races'));

// all of our routes will be prefixed with /api
app.use('/api', router);

// Start the server
app.listen(port);

console.log('Listening on http://localhost: ' + port);
