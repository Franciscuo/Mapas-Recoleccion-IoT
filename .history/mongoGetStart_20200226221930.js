var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://laser:laser*1234@cluster0-kt6sj.mongodb.net?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  var dbo = db.db("mydb");
  dbo.createCollection("customers", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});
