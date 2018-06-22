const server = require('./server');

it("returns a converted price with two decimal places ", () => {

    expect(server.addDecimal(55)).toEqual(true);
})