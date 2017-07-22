const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const url = process.env.MONGO_URL;

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const stripe = require("stripe")(keySecret);
const bodyParser = require("body-parser");

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/renewal', function(req, res) {
  res.render('pages/renewal');
});

// POST /payment gets urlencoded bodies
app.post('/payment', urlencodedParser, function(req, res) {

  if (!req.body) return res.sendStatus(400)
   res.render('pages/result', {data: req.body});

  var item = {
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  };
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
  console.log(url);
});
