var express = require('express');
var request = require('request');
var router  = express.Router();

var vProxyPath = '/';
var vProxySrv  = 'https://api.clubrural.com';
var vProxyURL  = '';

module.exports = router;

router.use(vProxyPath, function(req, res) {
    vProxyURL = vProxySrv + req.url;
    req.pipe(request(vProxyURL, reqCallBack)).pipe(res);
});

function reqCallBack(error, response, body) {
    if (error) { 
        console.error('proxy error: ' + error);
        res.sendStatus(503); // Service Unavailable
    } else {
    	console.log('proxy to ' + vProxyURL);
    }
}