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
let key = gdaxData.key || "BTC-USD";
//variables to hold async objects to send client
// let productObj;
// let orderBook;
let currentData;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));

io.on('connection', socketConnection => {
gdaxData.webSocketConnect.on('message', feedData => {
    // console.log("true")
    switch(feedData.type){
        case 'snapshot':
            currentData = initOrder(feedData);
        break;
        case 'l2update':
        //is it a buy or sell?  does the price match current top of book?
            // console.log(feedData)
            // console.log(currentData);
            l2UpdateCheck(feedData.changes, currentData)
        break;
        case 'ticker':
            // console.log(feedData);
            currentData.bidOnePrice = convertedPrice(feedData.best_bid);
            currentData.askOnePrice = convertedPrice(feedData.best_ask);
            // console.log(currentData)
    }
    // console.log(currentData)
});
convertedPrice = (price) => {
    //prices come in different lengths from feed. 
    let decimal = price.indexOf('.') + 3 ;
    return price.toString().includes('.') === false ? price + '.00' : price.split('').splice(0, decimal).join('');  
}

priceCheck = (currentData) => { 
// check second level within range
}
getSecondLevel = (bestPrice, side) => {
    //take new updated price and return the array 
}
initOrder = (feedData) => {
    const orderBook = {
        bids: feedData.bids.sort((a, b)=>  b-a),
        asks: feedData.asks.sort((a, b)=>  a-b),
    }
    // console.log(orderBook);
    let currentData = {
        bidOnePrice: convertedPrice(orderBook.bids[0][0]),
        bidOneSize: convertedPrice(orderBook.bids[0][1]),
        bidTwoPrice: convertedPrice(orderBook.bids[1][0]),
        bidTwoSize: convertedPrice(orderBook.bids[1][1]),
        askOnePrice: convertedPrice(orderBook.asks[0][0]),
        askOneSize: convertedPrice(orderBook.asks[0][1]),
        askTwoPrice: convertedPrice(orderBook.asks[1][0]),
        askTwoSize: convertedPrice(orderBook.asks[1][1])
    }
    

    return currentData;
}
updateBestMaket = (tickerData, currentData) => {
    
//    console.log(tickerData)
    // let bestAsk = tickerData.tickerData.best_ask;
    
    // console.log(`updated best bid ${bestBid}
    // updated best ask ${bestAsk}`)
    
}
l2UpdateCheck = (changesArray, currentData) => {
    //get update price to the same format as orderbook snapshot.
    // console.log(changesArray)
    let compare = convertedPrice(changesArray[0][1]);
    
    let updatedSize = changesArray[0][2];
    // console.log(updatedSize)
    
    switch(true){
        case ((changesArray[0][0] === 'buy') && (compare === currentData.bidOnePrice)):
            // console.log(`bid, ${compare} size ${updatedSize}`);
            currentData.bidOneSize = updatedSize;
            break;
        case ((changesArray[0][0] === 'buy') && (compare === currentData.bidTwoPrice)):
            // console.log(`bid 2, ${compare}`);
            currentData.bidTwoSize = updatedSize;
            break;
        case ((changesArray[0][0] === 'sell') && (compare === currentData.askOnePrice)):
            // console.log(`ask, ${compare}`);
            currentData.askOneSize = updatedSize;
            break;
        case ((changesArray[0][0] === 'sell') && (compare === currentData.askTwoPrice)):
            // console.log(`ask---------------2, ${compare}`);
            currentData.askTwoSize = updatedSize;
            break;

    }
    io.sockets.emit('getDataFeed', currentData)
}


    // send currentData to client.
    
});

gdaxData.publicClient.getProducts().then(data => {
    productObj = data.map(i => {return i.id});
    return productObj;
})

//get orderbook, send to client
// const loadOrderBook = () => {
//     gdaxData.publicClient.getProductOrderBook(key, { level: 2 }).then(book => {
//         orderBook = {
//             sequence: book.sequence,
//             asks: [ book.asks[0], book.asks[1] ],
//             bids: [ book.bids[0], book.bids[1] ]
//         };
//         return orderBook;
//     }).catch(err => console.log(err))
// }
// update orderbook every 500 mil
// setInterval(loadOrderBook, 500);

app.get('/orderbook', (req, res) => {
   
    res.json([gdaxData.key, productObj]);
})
app.get('/products', (req, res) => {
    res.json(productObj);
});
// got the button info back to server. now set key to get updated key.
app.post('/productSelect', (req, res) => {
    key = req.body.productCode;
})
app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
});
//send key to gdax.js to update websocket config
module.exports = {
    key,
    // addDecimal

};