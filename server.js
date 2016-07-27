'use strict';

// Default Set-up
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var config = require('./config');

// Routes
var debugRoute = require('./routes/debug');
var scanRoute = require('./routes/scan');

app.get('/', function(req, res) {
    res.status(200).send('<img src="http://pokeapi.co/media/img/149.png"><br><h3>You found a Dragonite! Jking! 🙉</h3><br><i>If you are getting this message through Slack, please set append to /scan to your outgoing hook</i>');;
});

app.use('/scan', scanRoute);
app.use('/debug', debugRoute);

app.listen(port, function () {
    console.log('Pokemon Scanner is listening on PORT:', port);
});
