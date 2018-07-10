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
    return (parseFloat(bid) + parseFloat(ask))/2;
};

netChange = (price, openPrice) => {
    return (((parseFloat(price) - parseFloat(openPrice))/ parseFloat(openPrice))*100).toFixed(2);
};

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

initData = orderBook => {
    const { bids, asks } = orderBook;
    currentData = {
        bidOnePrice: convertedPrice(bids[0][0]),
        bidOneSize: convertedPrice(bids[0][1]),
        bidTwoPrice: convertedPrice(bids[2][0]),
        bidTwoSize: convertedPrice(bids[2][1]),
        askOnePrice: convertedPrice(asks[0][0]),
        askOneSize: convertedPrice(asks[0][1]),
        askTwoPrice: convertedPrice(asks[2][0]),
        askTwoSize: convertedPrice(asks[2][1]),
    }
    // opening price from a gDax rest endpoint for 
    // gdaxData.publicClient.getProduct24HrStats(key).then(data => currentData.netChange =  netChange(convertedPrice(data.last), convertedPrice(data.open)))
    currentData.midPoint = midPoint(currentData.bidOnePrice, currentData.askOnePrice)
    // console.log(currentData.midPoint)
    return currentData;
}

l2UpdateCheck = (changesArray, currentData, orderBook) => {
    //get update price to the same format as orderbook snapshot.
    let side = changesArray[0][0];
    let compare = convertedPrice(changesArray[0][1]);
    let updatedQty = changesArray[0][2];
    // const { [0]: [side, compare, updatedQty]} = changesArray;
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
        updateLoop = (side) => {
            for(let i = 0; i < side.length; i++){
                let check =convertedPrice(side[i][0]);
                // console.log(check, compare)
                if(check == compare){
                    // console.log(true, check);
                    side[i][1] = updatedQty;
                    // console.log(updatedQty)
                    return side[i][1];
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
    initData, 
    l2UpdateCheck,
    updateOrderBook,
    midPoint,
    netChange,
    pricesOnly
}