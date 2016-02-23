var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var UserModel  = require('./models/user');
var UserApi    = require('./api/users');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

mongoose.connect('mongodb://ashmore11:13-cheese-ass@ds015398.mongolab.com:15398/real_time_running');

// Routes for our api
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {

  next(); // make sure we go to the next routes and don't stop here

});

router.get('/', function(req, res) {

  res.json({ message: 'Welcome to the RealTimeRunning api.' });

});

router.route('/users')

  // Create a user
  .post(function(req, res) {

    UserApi.create(req.body, res);

  })

  // Find all users
  .get(function(req, res) {

    UserApi.get(null, res);

  });

router.route('/users/:id')

  // Find a user
  .get(function(req, res) {

    UserApi.get(req.params.id, res);

  })

  // Update a user
  .put(function(req, res) {

    UserApi.update(req.params.id, req.body, res);

  })

  // Delete a user
  .delete(function(req, res) {

    UserApi.remove(req.params.id, res);

  });

// all of our routes will be prefixed with /api
app.use('/api', router);

// Start the server
app.listen(port);

console.log('Listening on http://localhost: ' + port);
