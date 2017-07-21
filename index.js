const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://lltechnology:ll0505@ds117093.mlab.com:17093/ccc';

const stripe = require("stripe")(keySecret);
const bodyParser = require("body-parser");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/renewal', function(request, response) {
  response.render('pages/renewal');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
