// Decode Service

var configs = require('../config');
var geocoder = NodeGeocoder(config.bot);

// Adapter for Geocoder
module.export = {
    getAddress: function (addressString) {
        return geocoder.geocode(addressString);
    }
};
