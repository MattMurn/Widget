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
let key = "BTC-USD";

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));

gdaxData.webSocketConnect.on('message', feedData => {
    // destructed feedData and currentData for readability
    const { type, bids, asks, changes, best_bid, best_ask, price, open_24h } = feedData;
    switch(type){
        case 'snapshot':
            orderBook = {
                bids: bids.sort((a, b)=>  b-a),
                asks: asks.sort((a, b)=>  a-b),
            }
            currentData = wsLogic.initOrder(orderBook);
        break;
        case 'l2update':
            wsLogic.l2UpdateCheck(changes, currentData, orderBook)
        break;
        case 'ticker':
            let { bidOnePrice, bidTwoPrice, askOnePrice, askTwoPrice, midPoint, netChange } = currentData;
            bidOnePrice = wsLogic.convertedPrice(best_bid);
            bidTwoPrice = wsLogic.getSecondLevel(bidOnePrice, orderBook.bids);
            askOnePrice = wsLogic.convertedPrice(best_ask);
            askTwoPrice = wsLogic.getSecondLevel(askOnePrice, orderBook.asks);
            midPoint = (parseFloat(bidOnePrice) + parseFloat(askOnePrice))/2;
            netChange = (((price - open_24h)/ open_24h)*100).toFixed(2);
        }
    io.sockets.emit('getDataFeed', currentData)
});

app.post('/productSelect', (req, res) => {
    gdaxData.webSocketConnect.unsubscribe({ product_ids: [key], channels: ['level2', 'ticker'] });
    console.log(req.body.productCode);
    key = req.body.productCode;
    gdaxData.webSocketConnect.subscribe({ product_ids: [key], channels: ['ticker', 'level2'] });
});

gdaxData.publicClient.getProducts().then(data => {
    productObj = data.map(i => {return i.id});
    return productObj;
})

app.get('/products', (req, res) => {
    res.json(productObj);
});

console.log(key)
app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
});

module.exports = {
    key,
    getSecondLevel,
    convertedPrice

};