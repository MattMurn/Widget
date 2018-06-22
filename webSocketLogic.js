
convertedPrice = (price) => {
    //prices come in different lengths from feed. 
    let decimal = price.indexOf('.') + 3 ;
    return price.toString().includes('.') === false ? 
        price + '.00' : 
        price.split('').splice(0, decimal).join('');  
};

getSecondLevel = (bestPrice, side) => {
    
    let orderBookPriceOnly = side.filter(prices => {return prices.splice(1,1)}).join(',').split(',');
    let secondLevelPrice = orderBookPriceOnly[orderBookPriceOnly.indexOf(bestPrice) + 1];
    // if bad qoute, get the next closest array element from order book.
    if(secondLevelPrice >= (bestPrice *1.10) || bestPrice >= secondLevelPrice* 1.10){
        secondLevelPrice = orderBookPriceOnly[orderBookPriceOnly.indexOf(bestPrice) + 2]
    }
    return convertedPrice(secondLevelPrice);
}
initOrder = (orderBook) => {
   
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

l2UpdateCheck = (changesArray, currentData) => {
    //get update price to the same format as orderbook snapshot.
    let compare = convertedPrice(changesArray[0][1]);
    let updatedSize = changesArray[0][2];
    switch(true){
        case ((changesArray[0][0] === 'buy') && (compare === currentData.bidOnePrice)):
            currentData.bidOneSize = updatedSize;
            break;
        case ((changesArray[0][0] === 'buy') && (compare === currentData.bidTwoPrice)):
            currentData.bidTwoSize = updatedSize;
            break;
        case ((changesArray[0][0] === 'sell') && (compare === currentData.askOnePrice)):
            currentData.askOneSize = updatedSize;
            break;
        case ((changesArray[0][0] === 'sell') && (compare === currentData.askTwoPrice)):
            currentData.askTwoSize = updatedSize;
            break;
    }
}

module.exports = {
    convertedPrice,
    getSecondLevel, 
    initOrder, 
    l2UpdateCheck
}