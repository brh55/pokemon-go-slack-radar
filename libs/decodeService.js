// Decode Service

var configs = require('../config');
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder(configs.bot);

// Adapter for Geocoder
module.exports = {
    getAddress: function (addressString) {
        return geocoder.geocode(addressString);
    }
};
