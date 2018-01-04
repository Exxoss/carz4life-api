var express = require('express')
var bodyParser = require('body-parser')
var app = express()

var Bidding = require('./auction/bidding')
var Process = require('./auction/process')
var db = require('./database/database')

var port = (process.env.PORT || 5000)


db.observeAuctions(Process)


app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.type('json')
    res.status(200).send({'status': 'OK'})
})

app.post('/bid', function (req, res) {
    var data = req.body
    if (Bidding.bid(db, data['auction_id'], data['user_id'], data['new_price'])) {
        res.sendStatus(204)
    } else {
        res.sendStatus(409)
    }
})

console.log("API running on port ", port)
app.listen(port)