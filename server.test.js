const { updateOrderBook, convertedPrice, getSecondLevel } = require('./webSocketLogic');

// it("returns a converted price with two decimal places ", () => {

//     expect(convertedPrice(55)).toEqual('55.00');
// })
// //test 
let orderBook = {
    asks:[[199222, 2124312],[125292, 555],[8, 666],[12622, 777]],
    bids:[[4, 21212],[22, 333],[442, 333],[121222, 21343212]]
    
}
let tester = [[44, 21212],[22, 333],[44, 350],[121222, 21343212],[199222, 2124312],[12292, 555],[8, 666],[1222, 777]]
let compare = ['sell', 8, 700]
let buy = ['buy', 22, 1888]
            
// it('take in array of arrays, find index and return the next element', () => {
//     expect(getSecondLevel('199222', tester)).toEqual("12292");
// })

it('returns orderbook updated qty from l2update data feed', ()=> {

    expect(updateOrderBook(orderBook, buy[1], buy[2], 'buy' )).toBe(1888);
    expect(updateOrderBook(orderBook, compare[1], compare[2], 'sell' )).toBe(700);
})