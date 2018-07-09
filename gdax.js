const Gdax = require("gdax");
const server = require('./server');
const publicClient = new Gdax.PublicClient();
// console.log(`server.key === ${key}`)
const webSocketConnect = new Gdax.WebsocketClient( 'BTC-USD', 'wss://ws-feed.gdax.com', null, {
        "type": "subscribe",
        "channels": [
            "level2",
            "ticker"
        ] 
});
module.exports = {
    webSocketConnect,
    publicClient,
  
};