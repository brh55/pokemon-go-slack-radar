// Decode Service

var configs = require('../config');
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder(configs.geocoder);

// Adapter for Geocoder
module.exports = {
    getAddress: function (addressString, callback) {
        geocoder.geocode(addressString, callback);
    }
};
