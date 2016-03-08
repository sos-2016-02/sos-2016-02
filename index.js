var express = require("express");
var app = express();
var port = (process.env.PORT || 3000);

app.use("/", express.static(__dirname + "/static", {'extensions': ['html']}));

app.listen(port, () => {
	console.log("Web server is running and listening on port: " + port);
});

app.get("/time", (req, res) => {
	res.send(getFecha());
});

function getFecha(){
	
/* that was my proposal
var d=new Date();
var dia=new Array(7);
dia[0]="Domingo";
dia[1]="Lunes";
dia[2]="Martes";
dia[3]="Miercoles";
dia[4]="Jueves";
dia[5]="Viernes";
dia[6]="Sabado";
console.log( "Hoy es :" + d.getDay());*/




	var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
	var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
	var f = new Date();
	var m = f.getMinutes();
	var s = f.getSeconds();
	var minutos  = (m < 10) ? '0' + m : m;
	var segundos = (s < 10) ? '0' + s : s;
	var ret = diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear() + 
	" [" + f.getHours() + ":" + minutos + ":" + segundos + "]";
	return ret;
};
