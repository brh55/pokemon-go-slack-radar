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
    var sendMessage = function (url, message) {
        slack = new Slack(url);
        slack.send(message);
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
        parseHook: parseHook
    };
})();
