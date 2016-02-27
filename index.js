var cool = require("cool-ascii-faces");
/*console.log(cool());*/

var express =require("express");
var app = express(); 

app.get('/',function(req, res) {
	res.send(cool());
});


app.get('/about/population',function(req, res) {
	  res.send("TODO introduice this part of the data");
});

app.listen("3000");
