convertedPrice = price => {
    //prices come in different lengths from feed. 
    let decimal = price.indexOf('.') + 3 ;
    return (price.toString().includes('.') === false ? 
        price + '.00' : 
        price.split('').splice(0, decimal).join(''));  
};

getSecondLevel = (bestPrice, side) => {
    // new array copy of order book with just prices to find index 
    // think about taking this out and putting in a function for reusability or  
    // directly in websocket message... 
    let orderBookPriceOnly = side.filter(prices => prices.splice(1,1)).join(',').split(',');
    // console.log(`current best price ------ ${bestPrice}`)
    let secondLevelPrice = side[side.indexOf(bestPrice) + 1].toString();
    // console.log(secondLevelPrice)
    // if bad qoute, get the next closest array element from order book.
    if(secondLevelPrice >= (bestPrice *1.10) || bestPrice >= secondLevelPrice* 1.10){
        secondLevelPrice = side[orderBookPriceOnly.indexOf(bestPrice) + 2]
        // console.log(`if stale qoute = ${secondLevelPrice}`)
    }
        // console.log(convertedPrice(secondLevelPrice))
    return secondLevelPrice;
}

initOrder = orderBook => {
    let currentData = {
        bidOnePrice: convertedPrice(orderBook.bids[0][0]),
        bidOneSize: convertedPrice(orderBook.bids[0][1]),
        bidTwoPrice: convertedPrice(orderBook.bids[2][0]),
        bidTwoSize: convertedPrice(orderBook.bids[2][1]),
        askOnePrice: convertedPrice(orderBook.asks[0][0]),
        askOneSize: convertedPrice(orderBook.asks[0][1]),
        askTwoPrice: convertedPrice(orderBook.asks[2][0]),
        askTwoSize: convertedPrice(orderBook.asks[2][1])
    }
    return currentData;
}

l2UpdateCheck = (changesArray, currentData, orderBook) => {
    //get update price to the same format as orderbook snapshot.
    let side = changesArray[0][0];
    let compare = convertedPrice(changesArray[0][1]);
    let updatedQty = changesArray[0][2];
    switch(true){
        case ((side === 'buy') && (compare === currentData.bidOnePrice)):
            return currentData.bidOneSize = updatedQty;
            break;
        case ((side === 'buy') && (compare === currentData.bidTwoPrice)):
            return currentData.bidTwoSize = updatedQty;
            break;
        case ((side === 'sell') && (compare === currentData.askOnePrice)):
            return currentData.askOneSize = updatedQty;
            break;
        case ((side === 'sell') && (compare === currentData.askTwoPrice)):
            return currentData.askTwoSize = updatedQty;
            break;
        default:
            updateOrderBook(orderBook, compare, updatedQty, side);
    }
}
updateOrderBook = (orderBook, compare, updatedQty, side) => {
        //take in orderbook, is buy or sell, then update the array element with new size. 
        // let final = orderBook;
        // updatedQty = compare[2];
        // let bids = orderBook.bids.map(prices => prices.splice(1,1)).join(',').split(',');
        // console.log(compare, updatedQty)

        switch(side){
            
            case 'sell':
            for(let i = 0; i < orderBook.asks.length; i++){
                let check =orderBook.asks[i][0];
                // console.log(check)
                if(check == compare){
                    // console.log(true, check);
                    orderBook.asks[i][1] = updatedQty;
                    return orderBook.asks[i][1];
                }
            }
            break;
            case 'buy': 
            for(let i = 0; i < orderBook.bids.length; i++){
                let check = orderBook.bids[i][0];
                if(check == compare){
                    // console.log("bids", check);
                    // console.log(orderBook)
                    orderBook.bids[i][1] = updatedQty;
                    // console.log(orderBook)
                    return orderBook.bids[i][1];
                }
            }
            break;
        }
        
        // console.log(compare[0])
        // let priceIndex = compare[1].toString();
        // switch(compare[0]){
            
        //     case 'sell':
        //         let asks = orderBook.asks.map(prices => prices.splice(1,1)).join(',').split(',');
        //         console.log(orderBook.asks[asks.indexOf(priceIndex)]);
        //         console.log(asks.indexOf(priceIndex))
                
        //         // console.log(asks[asks.indexOf(compare[1].toString())]);
        //         // get index of prices only, 
        //         break;
        //     case 'buy':
        //         console.log(bids);
        //         break;
        //     default: 
        //         // return;
        // }
        // console.log(final)
        // return true;

        //take in orderbook

    
}
module.exports = {
    convertedPrice,
    getSecondLevel, 
    initOrder, 
    l2UpdateCheck,
    updateOrderBook
}