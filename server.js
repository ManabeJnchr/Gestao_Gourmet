const express = require("express");
const app = express();
const http = require('http').Server(app);

const port = 3000;

(async function main () {
    app.use(express.static(__dirname + "/public"));

    app.get('/', function (req, res) {
        res.sendFile(__dirname + "/public/html/index.html")
    })

    app.listen(port, function () {
        console.log(`# Server running on port: ${port}`)
    })
})()