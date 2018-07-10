//Node library using publicClient and WebSocket objs
const Gdax = require("gdax");
const publicClient = new Gdax.PublicClient();
//using public api 3rd parameter null
const webSocketConnect = new Gdax.WebsocketClient( 'BTC-USD', 'wss://ws-feed.gdax.com', null, {
        "type": "subscribe",
        "channels": [
            "level2",
            "ticker"
        ] 
});

module.exports = {
    webSocketConnect,
    publicClient
};