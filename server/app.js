var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var User       = require('./models/user');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

// ROUTES FOR OUR API
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {

  console.log('Something is happening.');

  next(); // make sure we go to the next routes and don't stop here

});

router.get('/', function(req, res) {

  res.json({ message: 'hooray! welcome to our api!' });

});

router.route('/users')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
  .post(function(req, res) {

    var user = User({
      name: req.body.name,
      id: req.body.id,
      email: req.body.email,
      profileImage: req.body.profileImage,
    });

    console.log('post');

    user.save(function(err) {

      console.log('saving');

      if (err) res.send(err);

      res.json({ message: 'User created!' });

    });

  })

  .get(function(req, res) {

    User.find(function(err, users) {

      if (err) res.send(err);

      res.json(users);

    });

  });

// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);

console.log('Listening on port: ' + port);
