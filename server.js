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
let socketTestKey = 'USD-BTC';

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));
//destructured wsLogic to make function calls more readable.
const { initData, convertedPrice, getSecondLevel,
        midPoint, netChange, pricesOnly, reOpen, marketCheck } = wsLogic;

io.on('connection', socket => {

    gdaxData.publicClient.getProducts()
    .then(data => {
        productObj = data.map(i => {return i.id});
        socket.emit('products', productObj)
    })
    socket.on('updateProduct', data => {
        console.log(data)
        socketTestKey = data.productCode;
    })
    gdaxData.publicClient.getProduct24HrStats('BTC-USD')
        .then( openPrice => {
           initNetChange = netChange(openPrice.last, openPrice.open);
           socket.emit('netChange', initNetChange);
       })
    // socket.on('getDataFeed', socket => {
    gdaxData.webSocketConnect.on('message', feedData => {
        const { type, asks, bids, changes, best_ask, best_bid, open_24h, price } = feedData;
        switch(type){
            case 'snapshot':
                orderBook = {
                    bids: bids,
                    asks: asks,
                };
                socket.emit('initBook', orderBook)         
            break;
            case 'l2update':
                // take changes array, compare prices and update qty.
                
                // socket.emit('l2update', feedData)
            break;
            case 'ticker':
                    // if market moves through bid or ask, recenter currentData object
                    // marketCheck(orderBookPrices, best_bid, best_ask);
                    // currentData.bidOnePrice = convertedPrice(best_bid);
                    // currentData.bidTwoPrice = getSecondLevel(orderBook.bids, orderBookPrices.bids, best_bid)
                    // currentData.askOnePrice = convertedPrice(best_ask);
                    // currentData.askTwoPrice = getSecondLevel(orderBook.asks, orderBookPrices.asks, best_ask)
                    // currentData.netChange = netChange(price, open_24h);
            }
    });
    // })
})



module.exports = {
    getSecondLevel,
    convertedPrice,
    reOpen
};