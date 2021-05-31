const express = require('express')
const app = express()
const http = require('http').createServer(app)
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3004

http.listen(PORT,()=>{
    console.log('Listening on port' + PORT)
})

app.use(
    express.urlencoded(
        {
            extended: true 
        }
    )
)
app.use(express.json()) ;

app.post("/ratingDriver", (req, res) => {
    var jsonData = JSON.parse(JSON.stringify(req.body)) ;

    console.log('Kaj hoiche') ;


    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost/";

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("myDB");
        var myobj = { 
            "driverName": jsonData.driverName,
            "driverRating": jsonData.driverRating
        };

        dbo.collection("driverInfo3").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
});