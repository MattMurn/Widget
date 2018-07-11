const gdaxData = require('./gdax');
const wsLogic = require('./webSocketLogic');
const path = require('path')
module.exports = app => {
    app.post('/productSelect', (req, res) => {
        reOpen(req.body.productCode);
    });
    //grab open and last trade for init net change.
    app.get('/initNetChange', (req, res) => {
        gdaxData.publicClient.getProduct24HrStats('BTC-USD')
        .then( openPrice => {
           initNetChange = netChange(openPrice.last, openPrice.open);
           res.json(initNetChange);
       })
       .catch(err => console.log(err));
    });
    
    app.get('/products', (req, res) => {
        gdaxData.publicClient.getProducts()
        .then(data => {
            let productObj = data.map(i => {return i.id});
            res.json(productObj);
        })
        .catch(err => console.log(err));
    });
    
    app.get('*', (req, res) => {
        res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
    });
}