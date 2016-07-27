var utilTest = require('nodeunit').testCase;
var slackService = require('../libs/slackService');
/**
 * Require your desired JS file you want to test
 *
 * @example
 * var desiredJs = require('../desiredJs');
 */

module.exports = utilTest({
    parseHook: function (test) {
        var mockBody = {
            channel_id: '123',
            team_id: '1',
            response_url: 'http://test.com'
        }

        var reqConfigs = slackService.parseHook(mockBody);
        test.equal(reqConfigs.channelId, '123');
        test.equal(reqConfigs.url, 'http://test.com');
        test.done();
    },
    buildField: function (test) {
        var expectedField = {
            title: 'Sample',
            value: 'We are cool',
            short: false
        }

        var generatedField = slackService.buildField('Sample', 'We are cool', false);

        test.equal(expectedField.title, generatedField.title);
        test.equal(expectedField.value, generatedField.value);
        test.equal(expectedField.short, generatedField.short);
        test.done();
    },

});
