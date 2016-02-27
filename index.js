var cool = require("cool-ascii-faces");
/*console.log(cool());*/

var express =require("express");
var app = express(); 

app.get('/',function(req, res){
	res.send(cool());
	console.log("New request!!");

});

app.listen("3000");
