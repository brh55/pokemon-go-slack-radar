'use strict';

var Slack = require('node-slack');
var config = require('../config');
var nodeUtil = require('util');

module.exports = (function () {
    var slack;

    /**
     * Slack Wrapper to send Slack message
     *
     * @param  {object) config containing response url and message
     * @param  {object} message object message to be send
     */
    var sendMessage = function (url, message) {
        if (!url) {
            console.log('~~Message cannot be sent, no response url provided');
        } else {
            slack = new Slack(url);
        }

        if (message) {
            slack.send(message);
        } else {
            console.log("~~~Message has not been properly created~~~~");
        }
    };

    /**
     * Builds a field within an attachment
     * @param  {string} title     title of field
     * @param  {string} value     value of field
     * @param  {string} shortBool boolean of short field, defaults false
     * @return {object}           field object
     */
    var buildField = function(title, value, shortBool) {
        var short = shortBool || false;

        return {
            title: title,
            value: value,
            short: short
        }
    };

    /**
     * Build response config based on payload of recieved message
     * @param  {object} requestBody body of payload
     * @return {object}             configs for message (channel, response_url)
     */
    var parseHook = function (body) {
        return {
            channelId: body.channel_id,
            channel: "#" + body.channel_name,
            domain: body.team_domain,
            user: body.user_name,
            teamId: body.team_id,
            token: body.token,
            url: body.response_url,
            userId: body.user_id
        }
    };

    return {
        sendMessage: sendMessage,
        parseHook: parseHook,
        buildField: buildField,
    };
})();
