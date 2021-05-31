const io = require('socket.io-client')
const socket = io.connect('http://localhost:3003') 
const axios = require('axios')

var riderCounter = 0, driverCounter = 0 ;

var riderName ;
var driverName,driverCarName ;

function getRandomValue() {
    return Math.random()*99 ;
}

setInterval(()=>{
    riderCounter++ ;
    riderName = "Rider" + riderCounter ;

    axios({
        method: 'post',
        url: 'http://localhost:8001/rider',
        data:{
            riderName : riderName ,
            riderCoorX : getRandomValue(),
            riderCoorY : getRandomValue(),
            riderDestX : getRandomValue(),
            riderDestY : getRandomValue()
        }
    }).then(res=>{
        console.log("ddddddddddddd") ;
    }).catch(error=>{
        //console.log(error) ;
    })
}, 1000);

setInterval(()=>{
    driverCounter++ ;
    driverName = "Driver" + driverCounter ;
    driverCarName = "Car" + driverCounter ;

    axios({
        method: 'post',
        url: 'http://localhost:8001/driver',
        data:{
            driverName : driverName ,
            driverCarName : driverCarName,
            driverCoorX : getRandomValue(),
            driverCoorY : getRandomValue(),
        }
    }).then(res=>{
        console.log("ddddddddddddd") ;
    }).catch(error=>{
        //console.log(error) ;
    })

}, 1000);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var count = 0 ;
socket.on("result", (data)=>{
    //console.log(data[count].riderName + " has found" + data[count].driverName + ". Car Name:" + data[count].driverCarName + ". Ride Fare: " + data[count].rideFare ) ;
    
    var myObject = data[count]

    console.log(myObject) ;

    console.log("===="+ myObject.driverName )

    axios({
        method: 'post',
        url: 'http://localhost:8001/ratingDriver',
        data:{
            driverName : myObject.driverName ,
            driverRating : getRandomInt(6)
        }
    }).then(res=>{
        console.log("ddddddddddddd") ;
    }).catch(error=>{
        //console.log(error) ;
    })

    count++ ;
})