var express = require('express');
var router = express.Router();
var request = require('request');

module.exports = router;

var paths='/api/v1/electrical-consume';
var apiServerHost = 'https://sos-2016-01.herokuapp.com';

router.use('/', function(req, res) {
    var url = apiServerHost + req.baseUrl + req.url;
    console.log('piped: '+req.baseUrl + req.url);


    req.pipe(request(url, requestCallback)).pipe(res);
});

function requestCallback(err, response, body) {
    if (err) {
        console.log("external API down");
        console.log(err);
        res.sendStatus(504);
    }
}