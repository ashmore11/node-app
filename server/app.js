var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var User       = require('./models/user');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

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

    var user = User({
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      profileImage: req.body.profileImage,
    });

    user.save(function(err) {

      if (err) res.send(err);

      res.json({ message: 'Successfully created user...' });

    });

  })

  // Find all users
  .get(function(req, res) {

    User.find(function(err, users) {

      if (err) res.send(err);

      res.json(users);

    });

  });

router.route('/users/:id')

  // Find a user
  .get(function(req, res) {

    User.findById(req.params.id, function(err, user) {

      console.log('found user', user)

      if (err) res.send(err);

      res.json(user);

    });

  })

  // Update a user
  .put(function(req, res) {

    User.findById(req.params.id, function(err, user) {

      if (err) res.send(err);

      user.id = req.body.id;
      user.name = req.body.name;
      user.email = req.body.email;
      user.profileImage = req.body.profileImage;

      // Save the user
      user.save(function(err) {

        if (err) res.send(err);

        res.json({ message: 'Successfully updated user...' });

      });

    });

  })

  // Delete a user
  .delete(function(req, res) {

    User.remove({ _id: req.params.bear_id }, function(err) {

      if (err) res.send(err);

      res.json({ message: 'Successfully deleted user...' });

    });

  });

// all of our routes will be prefixed with /api
app.use('/api', router);

// Start the server
app.listen(port);

console.log('Listening on http://localhost: ' + port);
