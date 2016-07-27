// Check Route
// This route is mainly used for debugging purposes
'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var dragoniteImg = '<img src="http://pokeapi.co/media/img/149.png">';
    res.status(200).send(dragoniteImg + 
      '<br><h3>You found a Dragonite! Jking! 🙉</h3><br><i>If you are getting this message through Slack, please set append to /scan to your outgoing hook</i>');;
});

module.exports = router;
