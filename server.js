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
let key = gdaxData.key || "BTC-USD";
let productArray = [];
let openPrice;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));

app.post('/productSelect', (req, res) => key = req.body.productCode);

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
            wsLogic.l2UpdateCheck(feedData.changes, currentData, orderBook)
        break;
        case 'ticker':
        // console.log(feedData)
            currentData.bidOnePrice = wsLogic.convertedPrice(feedData.best_bid);
            currentData.bidTwoPrice = wsLogic.getSecondLevel(currentData.bidOnePrice, orderBook.bids);
            currentData.askOnePrice = wsLogic.convertedPrice(feedData.best_ask);
            currentData.askTwoPrice = wsLogic.getSecondLevel(currentData.askOnePrice, orderBook.asks);
            currentData.midPoint = (parseFloat(currentData.bidOnePrice) + parseFloat(currentData.askOnePrice))/2;
            currentData.netChange = (((feedData.price - feedData.open_24h)/ feedData.open_24h)*100).toFixed(2);
    }
    console.log(currentData.midPoint)
    io.sockets.emit('getDataFeed', currentData)
});
//get products api to get list of products to send to client
gdaxData.publicClient.getProducts().then(data => {
    productArray = data.map(i => i.id);
    return productArray;
});
gdaxData.publicClient.getProduct24HrStats('BTC-USD')
.then(data => openPrice = wsLogic.convertedPrice(data.open));

app.get('/products', (req, res) => res.json(productArray));

app.get('/openPrice', (req, res)=> res.json(openPrice))

app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
});

module.exports = {
    key,
    getSecondLevel,
    convertedPrice,
    app
};