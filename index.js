var express =require("express");
var app = express();
var port = (process.env.PORT || 3000);

app.use("/", express.static(__dirname + "/static"));

app.listen(port, () => {
	console.log("Web server is running and listening on port: " + port);
});

app.get("/", (req, res) => {
	res.send(redirect("index.html"));
});


app.get("/time", (req, res) => {
	res.send(getFecha());
});

app.get("/about", function(req, res) {
	res.send(redirect("about.html"));
});


app.get("/about/population", function(req, res) {
	res.send(redirect("population.html"));
});


app.get("/about/workers", function(req, res) {
	res.send(redirect("workers.html"));
});


app.get("/about/olders", function(req, res) {
	res.send(redirect("olders.html"));
});

function redirect(pageName){
	return "<script>window.location.href='/" + pageName + "';</script>";
};

function getFecha(){
	var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
	var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
	var f = new Date();
	var m = f.getMinutes();
	var s = f.getSeconds();
	var minutos  = (m < 10) ? '0' + m : m;
	var segundos = (s < 10) ? '0' + s : s;
	var ret = diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear() + " [" + f.getHours() + ":" + minutos + ":" + segundos + "]";
	return ret;
};