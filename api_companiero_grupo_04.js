var request = require( 'request');
var express =require('express');
var router  = express.Router();
var bodyParser = require('body-parser');

var app = express();
 
router.use(bodyParser.json());
router.use(express.static(__dirname+"/")); 

var paths='/';
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

/*var port =(process.env.PORT || 3000);

app.listen(port,()=>{
  console.log("Listening on port " + port);
});*/


//router.use(express.static('.'));

module.exports = router;
