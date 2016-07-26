'use strict';

// Default Set-up
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var token = require('./config').bot.slackToken;

// Libs
var bodyParser = require('body-parser');
var util = require('./libs/util');
var slackService = require('./libs/slackService');
var decodeService = require('./libs/decodeService');
var pokeService = require('./libs/pokeService');

var debugRoute = require('./routes/debug');

// Commonly used Middleware to parse JSON request
var urlEncodeParser = bodyParser.urlencoded({extended: true});

app.post('/', urlEncodeParser, function (req, res) {
    // if request doesn't contain body, respond with 400 error.

    // Assuming that the user wants to ensure
    // request is originating from own server
    if ((token) && (req.body.token === token)) {
        var request = slackService.parseHook(req.body);

        // If the address field is empty, inform user
        if (!req.body.text) {
            slackService.sendMessage(request.url, {
                channel: request.channel,
                text: request.user + ", looks like you forgot to include an address."
            });
        } else {
            // Decode and Send Pokemon Information
            var coords = decodeService.getAddress(req.body.text, function (err, address) {
                console.log(err);
                console.log(address);

                slackService.sendMessage(message);
            })
        }

        res.sendStatus(200);
    }
});

app.use('/debug', debugRoute);

app.listen(port, function () {
    console.log('Slack Contentful is listening on PORT:', port);
});
