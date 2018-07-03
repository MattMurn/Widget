module.exports = app => {
    let productArray;
    app.get('/products', (req, res) => res.json(productArray));
    let openPrice;
    app.get('/openPrice', (req, res)=> res.json(openPrice))

    app.get('*', (req, res) => {
        res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
    });

    app.post('/productSelect', (req, res) => key = req.body.productCode);
}