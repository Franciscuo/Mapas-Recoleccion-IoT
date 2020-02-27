var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://laser:laser*1234@cluster0-kt6sj.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});
