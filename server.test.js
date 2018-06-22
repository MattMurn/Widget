const { convertedPrice, getSecondLevel} = require('./server');

it("returns a converted price with two decimal places ", () => {

    expect(convertedPrice(55)).toEqual('55.00');
})
//test 
let tester = [[44, 21212],[22, 333],[44, 333],[121222, 21343212],[199222, 2124312],[12292, 555],[8, 666],[1222, 777]]
            
it('take in array of arrays, find index and return the next element', () => {
    expect(getSecondLevel('199222', tester)).toEqual("12292");
})