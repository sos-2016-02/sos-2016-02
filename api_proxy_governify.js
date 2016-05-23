var express = require('express');
var router = express.Router();
var request = require('request');

module.exports = router;

var apiServerHost = 'http://datastore.governify.io';

router.use('/', function(req, res) {
    var url = apiServerHost + req.url;
    console.log('piped: ' + req.baseUrl + req.url + ' to ' + url);
    req.pipe(request(url, requestCallback)).pipe(res);
});

function requestCallback(err, response, body) {
    if (err) {
        console.log("external API down");
        console.log(err);
        res.sendStatus(504);
    }
}
