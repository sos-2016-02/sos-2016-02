var express = require('express');
var request = require('request');
var router  = express.Router();

var proxyPath = '/';
var proxySrv  = 'https://sos-2016-01.herokuapp.com';
var proxyURL  = '';

module.exports = router;

router.use(proxyPath, function(req, res) {
    proxyURL = proxySrv + req.baseUrl + req.url;
    req.pipe(request(proxyURL, reqCallBack)).pipe(res);
});

function reqCallBack(err, response, body) {
    if (err) {
        console.log(err);
        res.sendStatus(503); // Service Unavailable
    } else {
    	console.log("proxy to " + proxyURL);
    }
}