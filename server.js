const EventEmitter = require('events');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const server = app.listen(PORT,() => console.log(`Widget app currently listening on Port: ${PORT}`))
const socket = require('socket.io');
const io = socket(server);
const bodyParser = require('body-parser');
const gdaxData = require('./gdax');
const emitter = new EventEmitter();
let key = gdaxData.key || "BTC-USD";
//variables to hold async objects to send client
let productObj;
let orderBook;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));

emitter.setMaxListeners(12);

io.on('connection', socketConnection => {
    gdaxData.webSocketConnect.on('message', data => {
        io.sockets.emit('getDataFeed', data);
    });
});

gdaxData.publicClient.getProducts().then(data => {
    productObj = data.map(i => {return i.id});
    return productObj;
})

//get orderbook, send to client
const loadOrderBook = () => {
    gdaxData.publicClient.getProductOrderBook(key, { level: 2 }).then(book => {
        orderBook = {
            sequence: book.sequence,
            asks: [ book.asks[0], book.asks[1] ],
            bids: [ book.bids[0], book.bids[1] ]
        };
        return orderBook;
    })
}
// update orderbook every 500 mil
setInterval(loadOrderBook, 350);

app.get('/orderbook', (req, res) => {
   
    res.json([orderBook,gdaxData.key, productObj]);
})
app.get('/products', (req, res) => {
    res.json(productObj);
});
// got the button info back to server. now set key to get updated key.
app.post('/productSelect', (req, res) => {
    key = req.body.productCode;
})
app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
});
//send key to gdax.js to update websocket config
module.exports = key;