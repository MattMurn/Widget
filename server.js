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
let initNetChange;



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));

const { initOrder, convertedPrice, getSecondLevel, midPoint, netChange } = wsLogic;
gdaxData.webSocketConnect.on('message', feedData => {
    const { type, asks, bids, changes, best_ask, best_bid, open_24h, price } = feedData;
    switch(type){
        case 'snapshot':
            orderBook = {
                bids: bids.sort((a, b)=>  b-a),
                asks: asks.sort((a, b)=>  a-b),
            }
            currentData = initOrder(orderBook, key);
            // console.log(netChange(initPrice, open))
            // currentData.netChange = netChange(initPrice, open);
            
        break;
        case 'l2update':
            l2UpdateCheck(changes, currentData, orderBook)
        break;
        case 'ticker':
        // console.log("Ticker")
            currentData.bidOnePrice = convertedPrice(best_bid);
            currentData.bidTwoPrice = getSecondLevel(currentData.bidOnePrice, orderBook.bids);
            currentData.askOnePrice = convertedPrice(best_ask);
            currentData.askTwoPrice = getSecondLevel(currentData.askOnePrice, orderBook.asks);
        //     currentData.midPoint = midPoint(currentData.bidOnePrice, currentData.askOnePrice);
        //    currentData.netChange = netChange(price, open_24h);
        }
    io.sockets.emit('getDataFeed', currentData)
    
});
app.post('/productSelect', (req, res) => {
    gdaxData.webSocketConnect.unsubscribe({ product_ids: [key], channels: ['level2', 'ticker'] });
    // console.log(req.body.productCode);
    key = req.body.productCode;
    gdaxData.webSocketConnect.subscribe({ product_ids: [key], channels: ['ticker', 'level2'] });
});
 gdaxData.publicClient.getProduct24HrStats(key)
 .then( openPrice => {
    initNetChange = netChange(openPrice.last, openPrice.open);
    return initNetChange;
});
app.get('/initNetChange', (req, res) => {
    res.json(initNetChange)
})
// console.log(tester)
gdaxData.publicClient.getProducts().then(data => {
    productObj = data.map(i => {return i.id});
    return productObj;
})

// console.log(netChange, "Next change")
// console.log(currentData.netChange)
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