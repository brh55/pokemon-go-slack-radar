// Decode Service

var configs = require('../config');
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder(configs.geocoder);

// Converts from degrees to radians.
Math.toRadians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.toDegrees = function(radians) {
  return radians * 180 / Math.PI;
};

var GeoService = (function () {
    var getAddress = function (addressString, callback) {
        geocoder.geocode(addressString, callback);
    };
    var getBounds = function (lat, long) {
        var earthRadius = 6371;
        var radius = .42; // Within 5 minute of walking distance of the center of city
        var x1 = long - Math.toDegrees(radius/earthRadius/Math.cos(Math.toRadians(lat)));
        var x2 = long + Math.toDegrees(radius/earthRadius/Math.cos(Math.toRadians(lat)));
        var y1 = lat + Math.toDegrees(radius/earthRadius);
        var y2 = lat - Math.toDegrees(radius/earthRadius);

        return [y1, x1, y2, x2];
    };

    return {
        getAddress: getAddress,
        getBounds: getBounds
    }
})();

// Adapter for Geocoder
module.exports = GeoService;
