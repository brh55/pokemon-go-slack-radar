'use strict';

var Slack = require('node-slack');
var config = require('../config');
var nodeUtil = require('util');

module.exports = (function () {
    var slack;

    if (nodeUtil.isUndefined(config.webhook)) {
        console.log('Please ensure webhook is properly set up');
    } else {
        slack = new Slack(config.webhook);
    }

    /**
     * Slack Wrapper to send Slack message
     *
     * @param  {object) config containing response url and message
     * @param  {object} message object message to be send
     */
    var sendMessage = function (url, simpleBool, message, type, preText) {
        slack = new Slack(url);

        var attachments = [];
        var attachment = {};
        attachment.text = message.text;
        attachment.pretext = message.pre_text;

        switch (type) {
            case 'error':
                attachment.color = '#e74c3c';
                break;

            case 'warning':
                attachment.color = '#f39c12';
                break;

            case 'success':
                attachment.color = '#2ecc71';
                break;

            default:
                attachment.color = '#bdc3c7';
                break;
        };

        var fullMessage = {
            text: preText,
            attachments: [
                attachment
            ]
        };

        console.log(fullMessage);

        if (simpleBool) {
            slack.send(message);
        } else {
            slack.send(fullMessage);
        }
    };

    var buildField = function(title, value, shortBool) {
        return {
            title: title,
            value: value,
            short: shortBool
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
