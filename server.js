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
let orderBook;
let orderBookPrices = {};

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));
// server-side routes
require('./controllerRoutes')(app);
//destructured wsLogic to make function calls more readable.
const { initData, convertedPrice, getSecondLevel,
        midPoint, netChange, pricesOnly, reOpen, marketCheck } = wsLogic;

gdaxData.webSocketConnect.on('message', feedData => {
    const { type, asks, bids, changes, best_ask, best_bid, open_24h, price } = feedData;
    switch(type){
        case 'snapshot':
            orderBook = {
                bids: bids.sort((a, b)=>  b-a),
                asks: asks.sort((a, b)=>  a-b),
            };
            // sets first two elements in orderbook to price and size 
            currentData = initData(orderBook);
            //get only prices into arrays to use as index for getSecondlevel function
            orderBookPrices.bids = pricesOnly(orderBook.bids);
            orderBookPrices.asks = pricesOnly(orderBook.asks);         
        break;
        case 'l2update':
            // take changes array, compare prices and update qty.
            l2UpdateCheck(changes, currentData, orderBook);
        break;
        case 'ticker':
                // if market moves through bid or ask, recenter currentData object
                marketCheck(orderBookPrices, best_bid, best_ask);
                currentData.bidOnePrice = convertedPrice(best_bid);
                currentData.bidTwoPrice = getSecondLevel(orderBook.bids, orderBookPrices.bids, best_bid)
                currentData.askOnePrice = convertedPrice(best_ask);
                currentData.askTwoPrice = getSecondLevel(orderBook.asks, orderBookPrices.asks, best_ask)
                currentData.netChange = netChange(price, open_24h);
        }
    io.sockets.emit('getDataFeed', currentData)
});

module.exports = {
    getSecondLevel,
    convertedPrice,
    reOpen
};