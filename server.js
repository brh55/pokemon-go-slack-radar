'use strict';

// Default Set-up
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

// Routes
var debugRoute = require('./routes/debug');
var scanRoute = require('./routes/scan');
var homeRoute = require('./routes/home');

app.use('/', homeRoute);
app.post('/scan', scanRoute);
app.use('/debug', debugRoute);

app.listen(port, function () {
    console.log('Pokemon Go Scanner is listening on PORT:', port);
});
