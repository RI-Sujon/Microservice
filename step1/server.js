const express = require('express')
const app = express()
const http = require('http').createServer(app)
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3002

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

var riderArray = []
var driverArray = []
var resultArray = []
var rideFare = 0.0 ; 

app.post('/rider', (req, res) => {
    var jsonData = JSON.parse(JSON.stringify(req.body));
    console.log(jsonData.riderName + " is looking for a driver......");
    riderArray.push(jsonData);
})

app.post('/driver', (req, res) => {
    var jsonData = JSON.parse(JSON.stringify(req.body)) ;
    console.log(jsonData.driverName + " is looking for a rider......");
    driverArray.push(jsonData);
})

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

        dbo.collection("driverInfo2").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
});

setInterval(()=>{
    for(var i=0; i<riderArray.length ; i++){
        rideFare = 0.0 ;
        var minDistance = Number.MAX_VALUE ;
        var flag = -1 ;

        for(var j=0 ; j<driverArray.length ; j++){
            var x = riderArray[i].riderCoorX - driverArray[i].driverCoorX;
            var y = riderArray[i].riderCoorY - driverArray[i].driverCoorY;
            var tempDis = Math.sqrt((x*x + y*y)) 

            if(tempDis<minDistance){
                minDistance = tempDis ;
                flag = j ;
            }
        }

        rideFare = minDistance*2 ;

        var outputResult = {
            "riderName" : riderArray[i].riderName,
            "driverName" : driverArray[flag].driverName,
            "driverCarName" : driverArray[flag].driverCarName,
            "rideFare" : rideFare 
        }

        resultArray.push(outputResult);

        riderArray.splice(i, 1) ;
        driverArray.splice(flag, 1) ;
    }
}, 5000)

//Socket

const io = require('socket.io')(http)

io.on("connection", (socket) => {
    console.log("Connected....")
    setInterval(()=>{
        socket.emit('result', resultArray)
    }, 5000) ;
    
})
