var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.MONGODB_URL, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  var dbo = db.db("mydb");
  dbo.createCollection("customers", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});
