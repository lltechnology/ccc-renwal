// index.js

// setup =========================================================================
// get all the variable setup

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const url = process.env.MONGO_URL;
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();

var stripe = require('stripe')('sk_test_rnH501ygqUSnlOfpijhbWxrA');
var assert = require('assert');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('port', (process.env.PORT || 5000));

// set up our express application
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');   // views is directory for all template files
app.set('view engine', 'ejs');


// root ============================================================================
app.get('/', function (req, res) {
  res.render('pages/disclaimer');
});

// renewal =========================================================================
app.get('/renewal', function (req, res) {
  res.render('pages/renewal', { title: 'Membership Renewal' });
});

// payment =========================================================================
app.post('/payment', urlencodedParser, function (req, res) {

  var item = {
    email: req.body.email,
    password: req.body.pwd,
    chinesename: req.body.chinesename,
    englishname: req.body.englishname,
    gender: req.body.gender,
    dob: req.body.dob,
    hkid: req.body.hkid,
    chinacard: req.body.chinacard,
    mobile: req.body.mobile,
    address: req.body.address,
    jerseysize: req.body.jerseysize,
    bibsize: req.body.bibsize,
    padtype: req.body.padtype,
    glovesize: req.body.glovesize,
    socksize: req.body.socksize,
  }
  var token = req.body.stripeToken;   // Get Token for Stripe
  var jerseykit = req.body.jerseykit;  // Get Jersey kit
  if (jerseykit.includes('apex')) {
    tamount = 220000; }
  else {
    tamount = 200000;
  }
  // Charge the user's card:
  var charge = stripe.charges.create({
    amount: tamount,
    currency: 'hkd',
    description: 'CCC Membership 2017-18 - ' + item.englishname + ' ()' + jerseykit + ')',
    source: token,
  }, function (err, charge) {
    // asynchronously called
  });

  // Mongo Connect ==================================================================
  MongoClient.connect('mongodb://ccc-king:ll0505@ds117093.mlab.com:17093/ccc', function (err, db) {
    assert.equal(null, err);
    db.collection('user-data').insertOne(item, function (err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });

  if (!req.body) return res.sendStatus(400);
  res.render('pages/result', {data: req.body});

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
