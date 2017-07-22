const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const url = process.env.MONGO_URL;

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const stripe = require("stripe")(keySecret);
const bodyParser = require("body-parser");
var assert = require("assert")

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

  var item = {
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.pwd,
    gender: req.body.gender,
    dob: req.body.dob,
    mobile: req.body.mobile,
    address: req.body.address,
    district: req.body.district,
    bibsize: req.body.bibsize,
    jerseysize: req.body.jerseysize,
    glovesize: req.body.glovesize,
    socksize: req.body.socksize
  };

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });

  if (!req.body) return res.sendStatus(400)
   res.render('pages/result', {data: req.body});

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
  console.log(url);
});
