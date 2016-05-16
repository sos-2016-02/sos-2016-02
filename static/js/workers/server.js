
var express =require('express');
var request = require('request');

var bodyParser = require('body-parser');
//var app =express();

var cors = require('cors');

var api  = express();
api.use(bodyParser.json());
api.use(cors());

api.get("/api",(req,res)=>{
  res.send({name :"gui trued",genre : "drama", year : "2013"})
});

api.listen(3500);

var app = express();  

app.use(express.static(__dirname+"/public"));  
var paths='/contacts';
var apiServerHost = 'https://contacts.herokuapp.com';

app.use(paths, function(req, res) {
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

//app.use(express.static('.'));

//app.listen(process.env.PORT || 8080); 

var port =(process.env.PORT || 10000);

app.listen(port,()=>{
	console.log("Listening on port " + port);
});


/*request({
  url :'https://api.someapi.com/oauth/token',
  method: 'POST',
  auth :{
    user: 'seacurfre',
    pass: 'password'
  },
  form:{
    'grant_type': 'client_credentials'
  }
},function(err, res){
  var json = JSON.parse(res.body);
  console.log("Access Token :", json.access_token);
});
*/

