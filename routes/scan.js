// Scanner route
// Must refactor, DRY up, and tidy
'use strict';

// Libs
var express = require('express');
var Promise = require('bluebird');
var bodyParser = require('body-parser');
var config = require('../config');
var slackService = require('../libs/slackService');
var geoService = require('../libs/geoService');
var S = require('string');

// Var Declarations
var token = config.bot.slackToken;

// Commonly used Middleware to parse URL Encoded request
var urlEncodeParser = bodyParser.urlencoded({extended: true});
var pokeService = require('../libs/pokeService');
var getPokemon = Promise.promisify(pokeService.getPokemon);

var router = express.Router();

router.post('/scan', urlEncodeParser, function (req, res) {
    // If request doesn't contain body, respond with 400 error.
    if (!req.body) res.sendStatus(400);

    // Assuming that the user wants to ensure
    // request is originating from own server
    if ((token) && (req.body.token === token)) {
        var request = slackService.parseHook(req.body);
        var input = S(req.body.text);

        var message = {};
        message.channel = request.channel;

        // If scan keyword does not exist, inform user
        if (!input.startsWith('scan')) {
            message.text = request.user + ', woops. Must include scan as the first trigger word.';

            slackService.sendMessage(request.url, message);
            res.sendStatus(200);
        } else {
            var intervalKeyword = 'every';
            var durationPattern = /\sfor\s/; // ' for '
            var addressEndIndex = (input.indexOf(intervalKeyword) > 0) ? 
                                input.indexOf(intervalKeyword) - 1:
                                input.length;

            // After 'Scan' and Before 'Every' parse address
            var address = input.substring(5, addressEndIndex).s;

            // Decode and Send Pokemon Information
            geoService.getAddress(address, function (err, result) {
                if (err) res.sendStatus(400);

                // Address is correct
                if (result.length === 1) {
                    var correctAddress = result[0].formattedAddress;
                    var coordinates = geoService.getBounds(result[0].latitude, result[0].longitude);

                    // Check for Interval Timer Set
                    if (input.contains(intervalKeyword)) {
                        var intervalKeywordStart = input.indexOf(intervalKeyword) + 
                                                                intervalKeyword.length;
                        var intervalKeywordEnd = input.indexOf('seconds') || input.length;
                        var intervalSeconds = input.substring(intervalKeywordStart, 
                                                                intervalKeywordEnd);
                        var intervalTime = intervalSeconds * 1000; // to milliseconds

                        // Ensure rescan time is greater than 30 seconds
                        if (intervalTime < 30000) {
                            message.text = 'Scanning every ' + intervalSeconds + ' seconds is too soon! Timer must be at least 30 seconds or greater.';
                            slackService.sendMessage(request.url, message);
                            res.status(200).send();
                            return;

                        // Duration is Set and Time is Greater than 30 Seconds
                        } else if (input.match(durationPattern)) {
                            var scan = function () {
                                scanAndSendCallback(coordinates, request.url, message, req, res, 
                                                    correctAddress);
                            };

                            var intervalObj = setInterval(scan, intervalTime)
                            var seconds = input.substring(input.match(durationPattern).index,
                                                            input.indexOf('minutes') || 
                                                            input.indexOf('minute'));
                            var milliseconds = seconds.trim().toInt() * 60000;
                            setTimeout(clearInterval(intervalObj), milliseconds);

                        // No duration was set, scan once for now
                        } else {
                            // @TODO - Allow user to cancel scan
                            scanAndSendCallback(coordinates, request.url, message, req, res, correctAddress);
                        }
                    } else {
                        // No interval timer set, send a once
                        scanAndSendCallback(coordinates, request.url, message, req, res, correctAddress);
                    }

                } else if (result.length > 0) {
                    // More than one address found
                    message.text = 'There were multiple addresses found, try entering one of these:'
                    message.attachments = [];
                    var attachmentObj = {};

                    // @TODO - Figure out interactivity with buttons
                    // to respond with
                    for (var i = 0; i < result.length; i++) {
                        var address = result[i].formattedAddress;
                        var numSelection = i + 1;
                        var tmpString = '\n' + numSelection + '. ' + address;

                        message.text += tmpString;
                    }

                    message.attachments.push(attachmentObj);

                    slackService.sendMessage(request.url, message);
                    res.status(200).send();
                } else {
                    // No address found
                    message.text = 'The address entered was not found';
                    slackService.sendMessage(request.url, message);
                    res.status(200).send();
                }
            });
        }
    }
});

/** @TODO - Abstract nested actions */
var scanAndSendCallback = function (coordinates, url, message, req, res, address) {
    getPokemon(coordinates).then(function(pokemonArray) {
        console.log(pokemonArray);
        var fields = [];
        var attachments = [];

        message.text = 'Scanned ' + address;

        for (var i = 0; i < pokemonArray.length; i++) {
            var pokemon = pokemonArray[i];
            var mediaUrl = 'http://pokeapi.co/media/img/'
                            + pokemonArray[i].pokemonId + '.png';
            var gmapUrl = 'https://www.google.com/maps/search/' 
                            + pokemon.latitude + '+' 
                            + pokemon.longitude;

            var attachmentObj = {
                fallback: pokemon.name + ' is ' + pokemon.distance_str 
                    + ' away and despawns in ' 
                    + pokemon.despawns_in_str,
                title: pokemon.name,
                title_link: gmapUrl,
                thumb_url: mediaUrl,
                fields: [],
                color: config.bot.updateColor
            };

            attachmentObj.fields
                .push(slackService.buildField('Distance',
                                            pokemon.distance_str,
                                            true));
            attachmentObj.fields
                .push(slackService.buildField('Despawns In',
                                            pokemon.despawns_in_str + ' mins',
                                            true));
            attachments
                .push(attachmentObj);
        }

        message.attachments = attachments;

        slackService.sendMessage(url, message);
        res.status(200).send();
    })
    .catch(function(err) {
        message.text = ':cry: ' + err.cause;

        slackService.sendMessage(url, message);
        res.status(200).send();
        return;
    });
};

module.exports = router;
