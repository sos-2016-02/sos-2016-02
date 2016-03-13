var express =require("express");
var bodyParser = require("body-parser");

var app = express();
var port = (process.env.PORT || 3000);

app.use(bodyParser.json());
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






// **************************************************
// http code status:
//     200 - Ok
//     404 - Not found
//     405 - Method Not Allowed
//     

var books = LoadInitialData();

function LoadInitialData() {
	arr = [];
	arr.push( { isbn : "123", name : "Administración de Oracle" } );
	arr.push( { isbn : "234", name : "Programación Java" } );
	arr.push( { isbn : "345", name : "Ingeniería del software" } );
	return arr;
}

// --------------------------------------------------
app.get("/api-test/books/LoadInitialData", (req,res)=> {
	books = LoadInitialData();
	res.sendStatus(200);
});
// --------------------------------------------------
app.post("/api/sandbox/books", (req,res)=> {
	var book = req.body;
	books.push(book);
	res.sendStatus(200);
});
app.get("/api/sandbox/books", (req,res)=> {
	if (books.length == undefined) {
		res.sendStatus(404);
	} else {
		res.send(books);	
	}
});
app.put("/api/sandbox/books", (req,res)=> {
	res.sendStatus(405);
});
app.delete("/api/sandbox/books", (req,res)=> {
	books = {};
	res.sendStatus(200);
});
// --------------------------------------------------
app.get("/api/sandbox/books/:isbn", (req,res) => {
	var isbn = req.params.isbn;
	var item = findByAttr(books,'isbn',isbn);
	if (item == null) {
		res.sendStatus(404);
	} else {
		res.send(item);
	}
});
app.put("/api/sandbox/books/:isbn", (req,res) => {
	var isbn = req.params.isbn;
	var statusCode;
	if (removeByAttr(books,'isbn',isbn) == 0){
		statusCode = 404;
	} else {
		var book = req.body;
		books.push(book);
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});
app.delete("/api/sandbox/books/:isbn", (req,res) => {
	var isbn = req.params.isbn;
	var statusCode;
	if (removeByAttr(books,'isbn',isbn) == 0){
		statusCode = 404;
	} else {
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});
// **************************************************

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
}

var findByAttr = function(arr, attr, value) {
	var ret = null;
	for (var i=0; i<arr.length; i++)
		if (arr[i][attr] == value)
			ret = arr[i];
	return ret;
}

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