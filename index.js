var cool = require("cool-ascii-faces");
/*console.log(cool());*/

var express =require("express");
var app = express(); 

app.get('/',function(req, res){
	res.send(cool());
	console.log("New request!!");

});

app.listen("3000");



/*function calcimc(){
	var masa = 50.0;
	
	var altura  = 1.58;
	var altura = altura*altura;
	return   masa / altura ;
}

console.log(calcimc());
*/
