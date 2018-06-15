const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const bodyParser = require('body-parser');
// get models using sequelize
let db;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'widgetclient/build')));

const test = {
    this: "hello from the server",
    
}
app.get('/testRoute', (req, res) => {
    console.log(test);
    res.json(test)
})
app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + './widgetclient/build/index.html'));
});

app.listen(PORT, () => console.log(`Widget app currently listening on Port: ${PORT}`));
