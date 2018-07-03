const { updateOrderBook, convertedPrice, getSecondLevel } = require('./webSocketLogic');

// it("returns a converted price with two decimal places ", () => {

//     expect(convertedPrice(55)).toEqual('55.00');
// })
// //test 
let orderBook = {
    bids:[[4, 21212],[22, 333],[442, 333],[121222, 21343212]],
    asks:[[199222, 2124312],[125292, 555],[8, 666],[12622, 777]]
}
let tester = [[44, 21212],[22, 333],[44, 350],[121222, 21343212],[199222, 2124312],[12292, 555],[8, 666],[1222, 777]]
let compare = ['sell', 99, 700]
            
// it('take in array of arrays, find index and return the next element', () => {
//     expect(getSecondLevel('199222', tester)).toEqual("12292");
// })

it('returns true', ()=> {

    expect(updateOrderBook(orderBook, compare)).toBe(false);
})