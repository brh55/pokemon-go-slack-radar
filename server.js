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
var Promise = require("bluebird");
var pokeScan = Promise.promisify(require('pokego-scan'));

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

                    pokeScan(coordinates).then(function(pokemonArray) {
                        console.log(pokemonArray.length > 1);
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
                                title_link: gmapUrl,
                                thumb_url: mediaUrl,
                                fields: [],
                                color:'#fbd478'
                            };

                            attachmentObj.fields.push(slackService.buildField("Distance", pokemon.distance_str, true));
                            attachmentObj.fields.push(slackService.buildField("Despawns In", pokemon.despawns_in_str + " mins", true));
                            attachments.push(attachmentObj);
                        }

                        message.attachments = attachments;


                        slackService.sendMessage(
                            request.url,
                            message
                        );

                        res.sendStatus(200);
                    })
                    .catch(function(err) {
                        slackService.sendMessage(
                            request.url,
                            {
                                channel: request.channel,
                                text: ':cry: Sorry, there is a issue with the Pokévision servers.',
                            }
                        );
                        res.sendStatus(200);
                        return;
                    });
                } else if (result.length > 0) {
                    // More than one address found
                    var preText = 'Which ' + input + ' did you mean?'

                    // @TODO - Figure out interactivity with buttons
                    // to respond with
                    for (var i = 0; i < result.length; i++) {
                        var address = result[i].formattedAddress;
                        var numSelection = i + 1;
                        var tmpString = '\n' + numSelection + '. ' + address;

                        message += tmpString;
                    }
                    slackService.sendMessage(
                        request.url,
                        {
                            channel: request.channel,
                            text: message,
                        }
                    );

                    res.sendStatus(200);
                } else {
                    // Nothing was found
                    slackService.sendMessage(
                        request.url,
                        {
                            channel: request.channel,
                            text: 'The address entered was not found',
                        }
                    );
                }
            });

        }
    }
});

app.use('/debug', debugRoute);

app.listen(port, function () {
    console.log('Pokemon Scanner is listening on PORT:', port);
});
