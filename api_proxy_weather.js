var express = require('express');
var request = require('request');
var router  = express.Router();

var vProxyPath = '/';
var vProxySrv  = 'http://api.openweathermap.org/data/2.5';
var vProxyURL  = '';

module.exports = router;

router.use(vProxyPath, function(req, res) {
    vProxyURL = vProxySrv + req.url;
    req.pipe(request(vProxyURL, reqCallBack)).pipe(res);
});

function reqCallBack(error, res, body) {
    if (error) { 
        console.error('proxy error: ' + error);
        res.sendStatus(503); // Service Unavailable
    } else {
    	console.log('proxy to ' + vProxyURL);
    }
}