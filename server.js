const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const server = app.listen(PORT,() => console.log(`Widget app currently listening on Port: ${PORT}`));
const socket = require('socket.io');
const io = socket(server);
const bodyParser = require('body-parser');
const gdaxData = require('./gdax');
const wsLogic = require('./webSocketLogic');
let key = "BTC-USD";
// declare global variables for later use.
// let initNetChange;
let orderBook;
let orderBookPrices = {};

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));
//destructured wsLogic to make function calls more readable.
const { initData, convertedPrice, getSecondLevel, midPoint, netChange, pricesOnly } = wsLogic;
// close current socket connection, update key, and reOpen
reOpen = req => {
    // console.log("reopen hit")
    gdaxData.webSocketConnect.unsubscribe({ product_ids: [key], channels: ['level2', 'ticker'] });
    key = req;
    gdaxData.webSocketConnect.subscribe({ product_ids: [key], channels: ['level2', 'ticker'] });
    return key;
};
// gdax object method to recieve subscription data.
gdaxData.webSocketConnect.on('message', feedData => {
    const { type, asks, bids, changes, best_ask, best_bid, open_24h, price } = feedData;
    //check type and perform various function, and ultimately send client currentData obj.
    switch(type){
        case 'snapshot':
            orderBook = {
                bids: bids.sort((a, b)=>  b-a),
                asks: asks.sort((a, b)=>  a-b),
            }
            // sets first two elements in orderbook to price and size 
            currentData = initData(orderBook);
            //get only prices into arrays to use as index for getSecondlevel function
            orderBookPrices.bids = pricesOnly(orderBook.bids)
            orderBookPrices.asks = pricesOnly(orderBook.asks)          
        break;
        case 'l2update':
            // take changes array, compare prices and update qty.
            l2UpdateCheck(changes, currentData, orderBook)
        break;
        case 'ticker':
            // if market moves w/o trade, recenter currentData object
            let bestBid = orderBookPrices.bids.indexOf(best_bid);
            let bestAsk = orderBookPrices.asks.indexOf(best_ask);
            // console.log(bestBid, best_bid)
            if(bestBid < 0 || bestAsk < 0){
                reOpen(key);
            }else {
                currentData.bidOnePrice = convertedPrice(best_bid);
                currentData.bidTwoPrice = getSecondLevel(orderBook.bids, orderBookPrices.bids, best_bid)
                currentData.askOnePrice = convertedPrice(best_ask);
                currentData.askTwoPrice = getSecondLevel(orderBook.asks, orderBookPrices.asks, best_ask)
                currentData.netChange = netChange(price, open_24h);
            }
        }
    io.sockets.emit('getDataFeed', currentData)
});
//update key and reopen websocket
app.post('/productSelect', (req, res) => {
    reOpen(req.body.productCode);
});
//grab open and last trade for init net change.
app.get('/initNetChange', (req, res) => {
    gdaxData.publicClient.getProduct24HrStats(key)
    .then( openPrice => {
       initNetChange = netChange(openPrice.last, openPrice.open);
       res.json(initNetChange)
   }).catch(err => console.log(err))
})

app.get('/products', (req, res) => {
    gdaxData.publicClient.getProducts().then(data => {
        let productObj = data.map(i => {return i.id});
        res.json(productObj);
    }).catch(err => console.log(err))
});

app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
});

module.exports = {
    key,
    getSecondLevel,
    convertedPrice,
};