'use strict';

var dotenv = require('dotenv');

dotenv.load();

var botConfigs = {
    port: Number(process.env.PORT) || 5000,
    updateColor: process.env.UPDATE_COLOR || '#fbd478',
    slackToken: process.env.SLACK_TOKEN
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
    geocoder: geocoderConfigs
};
