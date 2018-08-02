const gdaxData = require('./gdax')
const server = require('./server')
let key = 'BTC-USD'

convertedPrice = price => {
    //prices come in different lengths from l2update / ticker
    let decimal = price.indexOf('.') + 3;
    return (price.includes('.') === false ? 
        price + '.00' : 
        price.split('').splice(0, decimal).join(''));  
};
pricesOnly = (side) => {
    return side.filter(prices => prices.splice(1,1)).join(',').split(',')
};

midPoint = (bid, ask) => {
    return ((parseFloat(bid) + parseFloat(ask))/2).toFixed(4);
};

netChange = (price, openPrice) => {
    return (((parseFloat(price) - parseFloat(openPrice))/ parseFloat(openPrice))*100).toFixed(2);
};
// close current socket connection, update key, and reOpen
reOpen = req => {
    gdaxData.webSocketConnect.unsubscribe({ product_ids: [key], channels: ['level2', 'ticker'] });
    key = req;
    gdaxData.webSocketConnect.subscribe({ product_ids: [key], channels: ['level2', 'ticker'] });
    return key;
};

marketCheck = (orderBook, best_bid, best_ask) => {
    let  orderBookBidPrices = orderBook.bids.filter(el => el.splice(1,1));
    let orderBookAskPrices = orderBook.asks.filter(el => el.splice(1,1));
    let bestBid = orderBookBidPrices.indexOf(best_bid);
    let bestAsk = orderBookAskPrices.indexOf(best_ask);
    // console.log(bestBid, best_bid)
    console.log(bestAsk, best_ask)
    if(bestBid < 0 || bestAsk < 0){
        return reOpen(key);
    }
}

getSecondLevel = (orderBook, orderBookPrices, bestPrice) => {
    let secondLevelIndex = parseInt(orderBookPrices.indexOf(bestPrice)) +1;
    let secondLevel = orderBook[secondLevelIndex];
    if(secondLevel[0] >= (bestPrice * 1.10) || bestPrice >= secondLevel[0] * 1.10){
        secondLevel = orderBook[secondLevelIndex +1];
        return secondLevel[0]
    }else {
        return secondLevel[0];
    }
};


// l2UpdateCheck = (changesArray, currentData, orderBook) => {
//     //get update price to the same format as orderbook snapshot.
//     let side = changesArray[0][0];
//     let compare = convertedPrice(changesArray[0][1]);
//     let updatedQty = changesArray[0][2];
//     // const { [0]: [side, compare, updatedQty]} = changesArray;
//     switch(true){
//         case ((side === 'buy') && (compare === currentData.bidOnePrice)):
//             return currentData.bidOneSize = updatedQty;
//             break;
//         case ((side === 'buy') && (compare === currentData.bidTwoPrice)):
//             return currentData.bidTwoSize = updatedQty;
//             break;
//         case ((side === 'sell') && (compare === currentData.askOnePrice)):
//             return currentData.askOneSize = updatedQty;
//             break;
//         case ((side === 'sell') && (compare === currentData.askTwoPrice)):
//             return currentData.askTwoSize = updatedQty;
//             break;
//         default:
//             updateOrderBook(orderBook, compare, updatedQty, side);
//     }
// }

updateOrderBook = (orderBook, compare, updatedQty, side) => {
        //take in orderbook, is buy or sell, then update the array element with new size. 
        updateLoop = orderBookSide => {
            for(let i = 0; i < orderBookSide.length; i++){
                let check =convertedPrice(orderBookSide[i][0]);
                // console.log(check, compare)
                if(check == compare){
                    // console.log(true, check);
                    orderBookSide[i][1] = updatedQty;
                    return orderBookSide[i][1];
                }
            }
        }
        switch(side){
            case 'sell':
                updateLoop(orderBook.asks);
            break;
            case 'buy': 
                updateLoop(orderBook.bids);
            break;
        }
}

module.exports = {
    convertedPrice,
    getSecondLevel,
    // l2UpdateCheck,
    updateOrderBook,
    midPoint,
    netChange,
    pricesOnly,
    reOpen,
    key,
    marketCheck
}