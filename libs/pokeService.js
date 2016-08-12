'use strict';

var request = require('request');
var apiUrl = 'https://skiplagged.com/api/pokemon.php';

var pokeService = (function() {
    var getPokemon = function (coordinates, callback) {
        var requestUrl = apiUrl + buildQuery(coordinates);

        return request(requestUrl, function (err, res) {
            callback(err, res);
        });
    }

    var buildQuery = function (coordinates) {
        return 'bounds=' + coordinates.toString();
    }

    return {
        getPokemon: getPokemon,
        buildQuery: buildQuery
    }
})();

module.exports = pokeService;
