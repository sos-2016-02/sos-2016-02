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

//modify getFecha
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

/*function getFecha(){
	var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
	var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
	var f = new Date();
	var m = f.getMinutes();
	var s = f.getSeconds();
	var minutos  = (m < 10) ? '0' + m : m;
	var segundos = (s < 10) ? '0' + s : s;
	var ret = diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear() + " [" + f.getHours() + ":" + minutos + ":" + segundos + "]";
	return ret;
};*/

// propose this code for date 
// what do you think guys ??
function getFecha(){
	
var d=new Date();
var dia=new Array(7);
dia[0]="Domingo";
dia[1]="Lunes";
dia[2]="Martes";
dia[3]="Miercoles";
dia[4]="Jueves";
dia[5]="Viernes";
dia[6]="Sabado";
var m = d.getMonth() + 1;
var mesok = (m < 10) ? '0' + m : m;
var mesok=new Array(12);
mesok[0]="Enero";
mesok[1]="Febrero";
mesok[2]="Marzo";
mesok[3]="Abril";
mesok[4]="Mayo";
mesok[5]="Junio";
mesok[6]="Julio";
mesok[7]="Agosto";
mesok[8]="Septiembre";
mesok[9]="Octubre";
mesok[10]="Noviembre";
mesok[11]="Diciembre";
var ret = ("Hoy es: " + dia[d.getDay()]+ "Este mes es: " + mesok[mm.getMonth()]);
return ret;
};

