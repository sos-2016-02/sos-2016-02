var request = require( 'request');
var express =require('express');
var router  = express.Router();

module.exports = router;

var paths='/api/v1/population-unemployed-percentage-by-gender';
var apiServerHost = 'https://sos-2016-04.herokuapp.com';

router.use(paths, function(req, res) {
  var url = apiServerHost + req.baseUrl + req.url;
  console.log('piped: '+req.baseUrl + req.url);
  console.log('url access: ' +url);

  //tuberia hacia url response -> to obj response

  req.pipe(request(url,(error,response,body)=>{
  	if(error){
  		console.error(error);
  		res.sendStatus(503);
  	}
  })).pipe(res);
});

router.use(express.static('.'));


