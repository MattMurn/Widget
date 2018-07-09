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
let orderBook;
let orderBookPrices = {};

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));

const { initOrder, convertedPrice, getSecondLevel, midPoint, netChange, pricesOnly } = wsLogic;
gdaxData.webSocketConnect.on('message', feedData => {
    const { type, asks, bids, changes, best_ask, best_bid, open_24h, price } = feedData;
    switch(type){
        case 'snapshot':
            orderBook = {
                bids: bids.sort((a, b)=>  b-a),
                asks: asks.sort((a, b)=>  a-b),
            }
            currentData = initOrder(orderBook, key);
            orderBookPrices.bids = pricesOnly(orderBook.bids)
            orderBookPrices.asks = pricesOnly(orderBook.asks)            
        break;
        case 'l2update':
            l2UpdateCheck(changes, currentData, orderBook)
        break;
        case 'ticker':
        // console.log("Ticker")
            let bestBid = orderBookPrices.bids.indexOf(best_bid);
            let bestAsk = orderBookPrices.asks.indexOf(best_ask);
            if(bestBid < 0){
                reOpen(key);
            }else if(bestAsk < 0){
                reOpen(key)
            }
            currentData.bidOnePrice = convertedPrice(best_bid);
            currentData.bidTwoPrice = getSecondLevel(orderBook.bids, orderBookPrices.bids, best_bid)[0]
            // currentData.bidTwoSize = orderBook.bids[bestBid +1][1]
            currentData.askOnePrice = convertedPrice(best_ask);
            currentData.askTwoPrice = getSecondLevel(orderBook.asks, orderBookPrices.asks, best_ask)[0]
        //     currentData.midPoint = midPoint(currentData.bidOnePrice, currentData.askOnePrice);
           currentData.netChange = netChange(price, open_24h);
        //    console.log(currentData.bidOneSize)
        }
    io.sockets.emit('getDataFeed', currentData)
});
reOpen = req => {
    console.log("reopen hit")
    gdaxData.webSocketConnect.unsubscribe({ product_ids: [key], channels: ['level2', 'ticker'] });
    // console.log(req, 'req');
    key = req;
    gdaxData.webSocketConnect.subscribe({ product_ids: [key], channels: ['ticker', 'level2'] });
    // console.log(key, 'req')
    return key;
}
app.post('/productSelect', (req, res) => {
    reOpen(req.body.productCode);
    res.json(initNetChange)
});
 gdaxData.publicClient.getProduct24HrStats(key)
 .then( openPrice => {
    initNetChange = netChange(openPrice.last, openPrice.open);
});
app.get('/initNetChange', (req, res) => {
    res.json(initNetChange)
})
// console.log(tester)
gdaxData.publicClient.getProducts().then(data => {
    productObj = data.map(i => {return i.id});
    return productObj;
})

app.get('/products', (req, res) => {
    res.json(productObj);
});

app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
});

module.exports = {
    key,
    getSecondLevel,
    convertedPrice,
};