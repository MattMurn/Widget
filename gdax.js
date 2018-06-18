const Gdax = require("gdax");
let key = ["LTC-USD"]
const gdaxData = new Gdax.WebsocketClient( key, 'wss://ws-feed.gdax.com', null, {
    
        "type": "subscribe",
        "channels": [
            "level2"
            
            // {
            //     "name": "ticker",
            //     "product_ids": [
            //         "ETH-BTC",
            //         "ETH-USD"
            //     ]
            // } 
        ]
    
});


module.exports = gdaxData;