const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const server = app.listen(PORT,() => console.log(`Widget app currently listening on Port: ${PORT}`))
const socket = require('socket.io');
const io = socket(server);
const bodyParser = require('body-parser');
const gdaxData = require('./gdax');
let key = gdaxData.key;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));

io.on('connection', socketConnection => {
    gdaxData.webSocketConnect.on('message', data => {
        io.sockets.emit('getDataFeed', data);
    });
});

let productObj;
gdaxData.publicClient.getProducts().then(data => {
    productObj = data.map(i => {return i.id});
    // console.log(productObj)
    return productObj;
})
//get initial orderbook, send to client
let orderBook;
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

 setInterval(loadOrderBook, 500);
app.get('/orderbook', (req, res) => {
    res.json([orderBook,gdaxData.key, productObj]);
})
app.get('/products', (req, res) => {
    res.json(productObj);
});
// got the button info back to server. now set key to get updated key.
app.post('/productSelect', (req, res) => {
    console.log(req.body.productCode);
    key = req.body.productCode;
})
app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
});


