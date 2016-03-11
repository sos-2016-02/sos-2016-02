var express =require("express");
var app = express();
var port = (process.env.PORT || 3000);

app.use("/", express.static(__dirname + "/static"));

app.listen(port, () => {
	console.log("Web server is running and listening on port: " + port);
});

app.get("/", (req, res) => {
	res.send("<h1>Hello Word from group 02</h1><a href='/about'>about</a>");
});

app.get("/time", (req, res) => {
	res.send(getFecha());
});

function getFecha(){
	var meses      = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
	var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
	var fecha      = new Date();
	var m          = fecha.getMinutes();
	var s          = fecha.getSeconds();
	var minutos    = (m < 10) ? '0' + m : m;
	var segundos   = (s < 10) ? '0' + s : s;
	var ret        = diasSemana[fecha.getDay()] + ", " + fecha.getDate() + " de " + meses[fecha.getMonth()] + " de " + fecha.getFullYear() + " [" + fecha.getHours() + ":" + minutos + ":" + segundos + "]";
	return ret;
};