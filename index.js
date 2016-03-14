var express =require("express");
var bodyParser = require("body-parser");

var app = express();
var port = (process.env.PORT || 3000);

app.use(bodyParser.json());
app.use("/", express.static(__dirname + "/static"));

app.listen(port, () => {
	console.log("Web server is running and listening on port: " +port);
});

app.get("/", (req, res) => {
	res.send("<h1>Hello World from group 02</h1><a href='/about'>about</a>");
});

app.get("/time", (req, res) => {
	res.send(getFecha());
});


// books API **************************************************
var books = loadInitialDataBooks();

function loadInitialDataBooks() {
	arr = [];
	arr.push( { id : "123", title : "Administración de Oracle" } );
	arr.push( { id : "234", title : "Programación Java" } );
	arr.push( { id : "345", title : "Ingeniería del software" } );
	return arr;
}

// --------------------------------------------------
app.get("/api-test/books/loadInitialData", (req,res)=> {
	books = loadInitialDataBooks();
	res.sendStatus(200);
});
// --------------------------------------------------
app.post("/api/sandbox/books", (req,res) => {
	var book = req.body;
	books.push(book);
	res.sendStatus(200);
});
app.get("/api/sandbox/books", (req,res) => {
	res.send(books);
});
app.put("/api/sandbox/books", (req,res) => {
	res.sendStatus(405);
});
app.delete("/api/sandbox/books", (req,res) => {
	books = [];
	res.sendStatus(200);
});
// --------------------------------------------------
app.post("/api/sandbox/books/:id", (req, res) => {
		res.sendStatus(405);
});
app.get("/api/sandbox/books/:id", (req,res) => {
	var idValue = req.params.id;
	var item = findByAttr(books,'id',idValue);
	if (item == null) {
		res.sendStatus(404);
	} else {
		res.send(item);
	}
});
app.put("/api/sandbox/books/:id", (req,res) => {
	var idValue = req.params.id;
	var statusCode;
	if (removeByAttr(books,'id',idValue) == 0){
		statusCode = 404;
	} else {
		var book = req.body;
		books.push(book);
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});
app.delete("/api/sandbox/books/:id", (req,res) => {
	var idValue = req.params.id;
	var statusCode;
	if (removeByAttr(books,'id',idValue) == 0){
		statusCode = 404;
	} else {
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});

// linux-distributions API **************************************************
var linuxDistributions = [];

// --------------------------------------------------
app.get("/api-test/linux-distributions/loadInitialData", (req, res) => {
    linuxDistributions = [{ name: "Debian", url: "https://www.debian.org/" },
                          { name: "Arch Linux", url: "https://www.archlinux.org/" },
                          { name: "Antergos", url: "https://antergos.com/" }
                         ];
    res.sendStatus(200);
});
// --------------------------------------------------
app.post("/api/sandbox/linux-distributions/", (req, res) => {
    distro = req.body;
    linuxDistributions.push(distro);
    res.sendStatus(200);
});
app.get("/api/sandbox/linux-distributions/", (req, res) => {
    res.send(linuxDistributions);
});
app.put("/api/sandbox/linux-distributions/", (req, res) => {
	res.sendStatus(405);
});
app.delete("/api/sandbox/linux-distributions/", (req, res) => {
	linuxDistributions = [];
    res.sendStatus(200);
});
// --------------------------------------------------
app.post("/api/sandbox/linux-distributions/:name", (req, res) => {
	res.sendStatus(405);
});
app.get("/api/sandbox/linux-distributions/:name", (req, res) => {
	var name = req.params.name;
	var distro = findByAttr(linuxDistributions, 'name', name);
	if (distro == undefined) {
		res.sendStatus(404);
	} else {
		res.send(distro);
	}
});
app.put("/api/sandbox/linux-distributions/:name", (req, res) => {
    var name = req.params.name;
    if (removeByProperty(linuxDistributions, "name", name)) {
        distro = req.body;
        linuxDistributions.push(distro);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});
app.delete("/api/sandbox/linux-distributions/:name", (req, res) => {
	var name = req.params.name;
	if (removeByProperty(linuxDistributions, "name", name)) {
		res.sendStatus(200);
	} else {
		res.sendStatus(404);
	}
});

// films API **************************************************
var films = loadInitialDataFilms();

//------------------------------------------------
function loadInitialDataFilms() {
	arr = [];
	arr.push( { name : "True Grit", year : "2011" , genre : "Western", runningTime : "106", director: "Joel & Eazan Coen"});
	arr.push( { name : "13 days", year : "2000" , genre : "Political-Drama", runningTime : "148", director: "Roger Donalson"});
	arr.push( { name : "Jaws", year : "1975" , genre : "Action/Adventure", runningTime : "2h 4min", director: "Steven Spielberg"});
	return arr;
}
//------------------------------------------------
app.get("/api-test/films/loadInitialData", (req,res) => {
	films = loadInitialDataFilms();
	res.sendStatus(200);
});
//------------------------------------------------
app.post("/api/sandbox/films", (req,res) => {
	var film = req.body;
	films.push(film);
	res.sendStatus(200);
});
app.get("/api/sandbox/films", (req,res) => {
	res.send(films);
});
app.put("/api/sandbox/films", (req,res) => {
	res.sendStatus(404);
});
app.delete("/api/sandbox/films", (req,res) => {
	films = [];
	res.sendStatus(200);
});
//---------------------------------------------------
app.post("/api/sandbox/films/:name", (req, res) => {
	res.sendStatus(405);
});
app.get("/api/sandbox/films/:name", (req,res) => {
	var name = req.params.name;
	var item = findByAttr(films,'name',name);
	if (item == null) {
		res.sendStatus(404);
	} else {
		res.send(item);
	}
});
app.put("/api/sandbox/films/:name", (req,res) => {
	var name = req.params.name;
	var statusCode;
	if (removeByAttr(films,'name',name) == 0){
		statusCode = 404;
	} else {
		var film = req.body;
		films.push(film);
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});
app.delete("/api/sandbox/films/:name", (req,res) => {
	var name = req.params.name;
	var statusCode;
	if (removeByAttr(films,'name',name) == 0){
		statusCode = 404;
	} else {
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});


// Gobla functions ******************************************

var removeByAttr = function(arr, attr, value) {
	var i = arr.length;
	var cont = 0;
	while (i--) {
		if  (  arr[i]
			&& arr[i].hasOwnProperty(attr)
			&& (arguments.length > 2 && arr[i][attr] === value)
			) {
			arr.splice(i,1);
		cont++;
		}
	}
	return cont;
};

var removeByProperty = function(objectsArray, property, value) {
    var oldArrayLength = objectsArray.length;
    var newArray = objectsArray.filter((obj) => {
        return obj[property] != value;  // keep all except those with the value
    });
    if (newArray.length == objectsArray.length) {
        return false; // not found
    }
    // replace the old array by the new array
	objectsArray.length = 0;
    Array.prototype.push.apply(objectsArray, newArray);
    return true;
};

var findByAttr = function(arr, attr, value) {
	var ret = null;
	for (var i=0; i<arr.length; i++)
		if (arr[i][attr] == value)
			ret = arr[i];
	return ret;
};

var findByProperty = function(objectsArray, property, value) {
    return objectsArray.find((obj) => {
        return obj[property] == value;
    });
};

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