const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const bodyParser = require('body-parser');
const gdax = require('gdax')
// const publicClient = new gdax.PublicClient();
// process.env.GDAX_KEY
const Gdax = require("gdax");
const websocket = new Gdax.WebsocketClient(["BTC-USD"], 'wss://ws-feed.gdax.com', null, {
    
        "type": "subscribe",
        "channels": [
            "level2",
            "heartbeat",
            // {
            //     "name": "ticker",
            //     "product_ids": [
            //         "ETH-BTC",
            //         "ETH-USD"
            //     ]
            // }
        ]
    
})
// get models using sequelize
let db;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));

const test = {
    this: "hello from the server",
    
}


// app.get('/dataFeed', (req, res) => {
//     websocket.on('message', data => res.json(data));
// })
// websocket.unsubscribe({channels: ['full']});
// websocket.subscribe({product_ids: ['LTC-USD'], channels: ['ticker']})
// websocket.subscribe();
websocket.on('message', data => {
    console.log(data)
});
websocket.on('error', err => console.log(err));
websocket.on('close', () => {})
// publicClient.getProducts()
// .then(data => console.log(data))
app.get('/testRoute', (req, res) => {
    console.log(test);
    res.json(test)
})
app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
});

app.listen(PORT, () => console.log(`Widget app currently listening on Port: ${PORT}`));
