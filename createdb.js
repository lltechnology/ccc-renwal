var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://ccc-king:ll0505@ds117093.mlab.com:17093/ccc";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});
