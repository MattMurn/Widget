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
const wsLogic = require('./webSocketLogic');
let key;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));

gdaxData.webSocketConnect.on('message', feedData => {
    switch(feedData.type){
        case 'snapshot':
            orderBook = {
                bids: feedData.bids.sort((a, b)=>  b-a),
                asks: feedData.asks.sort((a, b)=>  a-b),
            }
            currentData = wsLogic.initOrder(orderBook);
        break;
        case 'l2update':
            wsLogic.l2UpdateCheck(feedData.changes, currentData)
        break;
        case 'ticker':
            currentData.bidOnePrice = wsLogic.convertedPrice(feedData.best_bid);
            currentData.bidTwoPrice = wsLogic.getSecondLevel(currentData.bidOnePrice, orderBook.bids);
            currentData.askOnePrice = wsLogic.convertedPrice(feedData.best_ask);
            currentData.askTwoPrice = wsLogic.getSecondLevel(currentData.askOnePrice, orderBook.asks);
    }
    io.sockets.emit('getDataFeed', currentData)
    
});

gdaxData.publicClient.getProducts().then(data => {
    productObj = data.map(i => {return i.id});
    return productObj;
})

app.get('/products', (req, res) => {
    res.json(productObj);
});
app.post('/productSelect', (req, res) => {
    // console.log(req.body.productCode);
    key = req.body.productCode;
    
})
console.log(key)
app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
});

module.exports = {
    key,
    getSecondLevel,
    convertedPrice

};