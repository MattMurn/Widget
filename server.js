const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const server = app.listen(PORT,() => console.log(`Widget app currently listening on Port: ${PORT}`))
const socket = require('socket.io');
const io = socket(server);
const bodyParser = require('body-parser');
const gdaxData = require('./gdax');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));

io.on('connection', socketConnection => {
  
    console.log("made connections");
    console.log(socketConnection.id);
    
    gdaxData.on('message', data => {
        io.sockets.emit('getDataFeed', data);
        // console.log(data.changes)
        // console.log(data.changes)
        // console.log(` Bids: ${data.bids}`)
        // console.log(`Asks: ${data.asks}`)
        
        // if(data.type === 'l2update' && data.changes[0][0] === 'sell' && data.changes[0][2] > 100){
        //     console.log(`${data.changes[0][0]} : ${data.changes[0][1]} : ${data.changes[0][2]}`)
        // //    console.log("udpate")
        // } else {
        //     // gdaxData.on('close', () => {console.log("web socket connection is closed.")})
        // }
        
    })

})

app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
});


