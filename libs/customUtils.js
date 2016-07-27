'use strict';

var nodeUtil = require('util');

module.exports = (function () {
    /**
     * Checks if all keys do not have undefined values string values
     *
     * @param  {object} object object in question
     * @return {boolean}        return if object contains undefined string values
     */
    var allDefined = function (object) {
        for (var key in object) {
            if (nodeUtil.isUndefined(object[key])) {
                return false;
            }
        }
        return true;
    };

    /**
     * Return undefined keys of object
     *
     * @param  {object} object object in question
     * @return {string}        string of undefined valued keys
     */
    var getUndefinedKeys = function (object, formatSeparator) {
        var undefKeys = [];
        for (var key in object) {
            if (nodeUtil.isUndefined(object[key])) {
                undefKeys.push(key);
            }
        }

        return undefKeys.toString().replace(/,/g, formatSeparator);
    };

    return {
        allDefined: allDefined,
        getUndefinedKeys: getUndefinedKeys
    };
})();
