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
    gdaxData.webSocketConnect.on('message', data => {
        io.sockets.emit('getDataFeed', data);
    });
})
//get initial orderbook, send to client
let orderbook;
loadOrderBook = () => {
    gdaxData.publicClient.getProductOrderBook(gdaxData.key, { level: 2 }).then(book => {
        orderbook = {
            sequence: book.sequence,
            asks: [ book.asks[0], book.asks[1] ],
            bids: [ book.bids[0], book.bids[1] ]
        };
        // console.log(orderbook)
        return orderbook;
        
    })
}
// update orderbook every 500 mil
setInterval(loadOrderBook, 500);
app.get('/orderbook', (req, res) => {
    res.json([orderbook,gdaxData.key]);
})

app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
});


