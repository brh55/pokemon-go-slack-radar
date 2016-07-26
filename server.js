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
// var pokeService = require('./libs/pokeService');
var pokeScan = require('pokego-scan');

var debugRoute = require('./routes/debug');

// Commonly used Middleware to parse JSON request
var urlEncodeParser = bodyParser.urlencoded({extended: true});

app.post('/', urlEncodeParser, function (req, res) {
    // if request doesn't contain body, respond with 400 error.

    // Assuming that the user wants to ensure
    // request is originating from own server
    if ((token) && (req.body.token === token)) {
        var request = slackService.parseHook(req.body);
        var input = req.body.text;

        // If the address field is empty, inform user
        if (!input) {
            slackService.sendMessage(
                request.url,
                true,
                {
                    channel: request.channel,
                    text: request.user + ', looks like you forgot to include an address.'
                }
            );

            res.sendStatus(200);
        } else {
            // Decode and Send Pokemon Information
            decodeService.getAddress(input, function (err, result) {
                if (err) res.sendStatus(400);
                var message = '';

                if (result.length === 1) {
                    var correctAddress = result[0].formattedAddress;
                    var coordinates = {
                        latitude: result[0].latitude,
                        longitude: result[0].longitude
                    };

                    pokeScan(coordinates, function(err, pokemonArray) {
                        if (err) {
                            slackService.sendMessage(
                                request.url,
                                false,
                                {
                                    channel: request.channel,
                                    text: ':cry: Sorry, there is a issue with the Pokévision servers.',
                                }
                            );
                            res.sendStatus(200);
                            return;
                        }

                        var fields = [];
                        var attachments = [];
                        var message = {};
                        message.text = 'Scanned ' + correctAddress;

                        for (var i = 0; i < pokemonArray.length; i++) {
                            var pokemon = pokemonArray[i];
                            var mediaUrl = 'http://pokeapi.co/media/img/' + pokemonArray[i].pokemonId + '.png';
                            var gmapUrl = 'https://www.google.com/maps/search/' + pokemon.latitude + '+' + pokemon.longitude;

                            var attachmentObj = {
                                fallback: pokemon.name + ' is ' + pokemon.distance_str + ' away and despawns in ' + pokemon.despawns_in_str,
                                title: pokemon.name,
                                thumb_url: mediaUrl,
                                fields: []
                            };

                            attachmentObj.fields.push(slackService.buildField("Distance", pokemon.distance_str + " m", true));
                            attachmentObj.fields.push(slackService.buildField("Despawns In", pokemon.despawns_in_str + " mins", true));
                            attachmentObj.fields.push(slackService.buildField("View Map", gmapLink, false));
                            attachments.push(attachmentObj);

                            console.log(attachments);
                        }

                        message.attachments = attachments;

                        slackService.sendMessage(
                            request.url,
                            true,
                            {
                                channel: request.channel,
                                text: message,
                            },
                            'success',
                            message.text
                        );
                    });
                } else if (result.length > 0) {
                    // More than one address found
                    var preText = 'Which ' + input + ' did you mean?'

                    // Add button later
                    for (var i = 0; i < result.length; i++) {
                        var address = result[i].formattedAddress;
                        var numSelection = i + 1;
                        var tmpString = '\n' + numSelection + '. ' + address;

                        message += tmpString;
                    }
                    slackService.sendMessage(
                        request.url,
                        true,
                        {
                            channel: request.channel,
                            text: message,
                        },
                        'error',
                        preText
                    );

                    res.sendStatus(200);
                } else {
                    // Nothing was found
                    var message = 'The address entered was not found';
                }

                console.log(result);
            });

        }
    }
});

app.use('/debug', debugRoute);

app.listen(port, function () {
    console.log('Slack Contentful is listening on PORT:', port);
});
