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
// server-side routes
require('./controllerRoutes')(app);
//destructured wsLogic to make function calls more readable.
const { initData, convertedPrice, getSecondLevel,
        midPoint, netChange, pricesOnly, reOpen, marketCheck } = wsLogic;


io.on('connection', socket => {
    socket.on('initProduct', data => {
        
    })
    socket.on('updateProduct', data => {
        console.log(data)
        socketTestKey = data.productCode;
    })
    // socket.on('getDataFeed', socket => {
        gdaxData.webSocketConnect.on('message', feedData => {
            
         
            const { type, asks, bids, changes, best_ask, best_bid, open_24h, price } = feedData;
            switch(type){
                case 'snapshot':
                console.log(feedData.type)
                socket.emit('initData', feedData)   
                break;
                case 'l2update':
                // socket.emit('getDataFeed', "l2")
        
                break;
                case 'ticker':
                    
                }
        });
    // })
})



module.exports = {
    getSecondLevel,
    convertedPrice,
    reOpen
};