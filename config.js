'use strict';

var dotenv = require('dotenv');

dotenv.load();

var botConfigs = {
    webhook: process.env.SLACK_WEBHOOK,
    port: Number(process.env.PORT) || 5000,
    emoji: process.env.BOT_EMOJI || 'robot_face',
    username: process.env.BOT_USERNAME || 'Mr_SlackBot',
    channel: '#' + process.env.SLACK_CHANNEL || '#default',
    updateColor: process.env.UPDATE_COLOR || '#27ae60'
};

var geocoderConfigs = {
  provider: 'google',
  httpAdapter: 'https', // Default 
  apiKey: process.env.GOOGLE_API_KEY || null,
  formatter: null         // 'gpx', 'string', ... 
};

/**
 * Export .env config values into into a config object
 *
 * @type {Object}
 */
module.exports = {
    bot: botConfigs,
    geocoder: geocodeConfigs
};
