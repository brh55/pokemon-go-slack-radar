// Check Route
// This route is mainly used for debugging purposes
'use strict';

// Libs
var express = require('express');
var Promise = require('bluebird');
var bodyParser = require('body-parser');
var config = require('../config');
var slackService = require('../libs/slackService');
var decodeService = require('../libs/decodeService');

// Var Decs
var token = config.bot.slackToken;

// Commonly used Middleware to parse URL Encoded request
var urlEncodeParser = bodyParser.urlencoded({extended: true});
var pokeScan = Promise.promisify(require('pokego-scan'));
var router = express.Router();


router.post('/scan', urlEncodeParser, function (req, res) {
    // if request doesn't contain body, respond with 400 error.
    if (!req.body) res.sendStatus(400);

    // Assuming that the user wants to ensure
    // request is originating from own server
    if ((token) && (req.body.token === token)) {
        var request = slackService.parseHook(req.body);
        var input = req.body.text;

        var message = {};
        message.channel = request.channel;

        // If the address field is empty, inform user
        if (!input) {
            message.text = request.user + ', looks like you forgot to include an address.';

            slackService.sendMessage(request.url, message);
            res.sendStatus(200);
        } else {
            // Decode and Send Pokemon Information
            decodeService.getAddress(input, function (err, result) {
                if (err) res.sendStatus(400);

                if (result.length === 1) {
                    var correctAddress = result[0].formattedAddress;
                    var coordinates = {
                        latitude: result[0].latitude,
                        longitude: result[0].longitude
                    };

                    pokeScan(coordinates).then(function(pokemonArray) {
                        var fields = [];
                        var attachments = [];

                        message.text = 'Scanned ' + correctAddress;

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

                        slackService.sendMessage(request.url, message);
                        res.sendStatus(200);
                    })
                    .catch(function(err) {
                        message.text = ':cry: Sorry, there is a issue with the Pokévision servers.';

                        slackService.sendMessage(request.url, message);
                        res.sendStatus(200);
                        return;
                    });
                } else if (result.length > 0) {
                    // More than one address found
                    message.text = 'Which ' + input + ' did you mean?'
                    message.attachments = [];
                    var attachmentObj = {};

                    // @TODO - Figure out interactivity with buttons
                    // to respond with
                    for (var i = 0; i < result.length; i++) {
                        var address = result[i].formattedAddress;
                        var numSelection = i + 1;
                        var tmpString = '\n' + numSelection + '. ' + address;

                        attachmentObj.fallback += tmpString;
                    }

                    message.attachments.push(attachmentObj);

                    slackService.sendMessage(request.url, message);
                    res.sendStatus(200);
                } else {
                    // No address found
                    message.text = 'The address entered was not found';
                    slackService.sendMessage(request.url, messsage);
                }
            });
        }
    }
});

module.exports = router;
