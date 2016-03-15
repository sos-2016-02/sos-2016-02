var tools = require('./tools');
var express = require('express');
var router = express.Router();

var books = loadInitialData();

// --------------------------------------------------
router.post('/', (req,res) => {
	var book = req.body;
	books.push(book);
	res.sendStatus(200);
});
router.get('/', (req,res) => {
	res.send(books);
});
router.put('/', (req,res) => {
	res.sendStatus(405);
});
router.delete('/', (req,res) => {
	books = [];
	res.sendStatus(200);
});

// --------------------------------------------------
router.post('/:id', (req,res) => {
	res.sendStatus(405);
});
router.get('/:id', (req,res) => {
	var idValue = req.params.id;
	var item = tools.findByAttr(books,'id',idValue);
	if (item == null) {
		res.sendStatus(404);
	} else {
		res.send(item);
	}
});
router.put('/:id', (req,res) => {
	var idValue = req.params.id;
	var statusCode;
	if (tools.removeByAttr(books,'id',idValue) == 0) {
		statusCode = 404;
	} else {
		var book = req.body;
		books.push(book);
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});
router.delete('/:id', (req,res) => {
	var idValue = req.params.id;
	var statusCode;
	if (tools.removeByAttr(books,'id',idValue) == 0) {
		statusCode = 404;
	} else {
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});

// ----------------------------------------------------------------------
function loadInitialData() {
	arr = [];
	arr.push( { id : "123", title : "Administración de Oracle" } );
	arr.push( { id : "234", title : "Programación Java"        } );
	arr.push( { id : "345", title : "Ingeniería del software"  } );
	return arr;
}

module.exports = router;