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

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('pages/renewal1');
});

app.get('/renewal', function (req, res) {
  res.render('pages/renewal', { title: 'Membership Renewal' });
});

// POST /payment gets urlencoded bodies
app.post('/payment', urlencodedParser, function (req, res) {

  var item = {
    email: req.body.email,
    password: req.body.pwd,
    firstname: req.body.chinesename,
    lastname: req.body.englishname,
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
  };

  // Token is created using Stripe.js or Checkout!
  // Get the payment token submitted by the form:
  var token = req.body.stripeToken;   // Using Express

  // Charge the user's card:
  var charge = stripe.charges.create({
    amount: 200000,
    currency: 'hkd',
    customer: req.body.firstname,
    description: 'CCC Membership Apex',
    source: token,
  }, function (err, charge) {
    // asynchronously called
  });

  MongoClient.connect('mongodb://ccc-king:ll0505@ds117093.mlab.com:17093/ccc', function(err, db) {
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
});
