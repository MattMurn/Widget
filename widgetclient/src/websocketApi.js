const io = require('socket.io-client');
let socket = io.connect('http://localhost:3000');

// 


function getDataFeed(channel) {
    socket.on(channel, data => {
        console.log((data));
    })
}

export { getDataFeed };