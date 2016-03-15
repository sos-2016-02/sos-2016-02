var tools = require('./tools');
var express = require('express');
var router = express.Router();

var films = loadInitialData();

// --------------------------------------------------
router.post('/', (req,res) => {
	var book = req.body;
	films.push(book);
	res.sendStatus(200);
});
router.get('/', (req,res) => {
	res.send(films);
});
router.put('/', (req,res) => {
	res.sendStatus(405);
});
router.delete('/', (req,res) => {
	films = [];
	res.sendStatus(200);
});

// --------------------------------------------------
router.post('/:name', (req,res) => {
	res.sendStatus(405);
});
router.get('/:name', (req,res) => {
	var nameValue = req.params.name;
	var item = tools.findByAttr(films,'name',nameValue);
	if (item == null) {
		res.sendStatus(404);
	} else {
		res.send(item);
	}
});
router.put('/:name', (req,res) => {
	var nameValue = req.params.name;
	var statusCode;
	if (tools.removeByAttr(films,'name',nameValue) == 0) {
		statusCode = 404;
	} else {
		var book = req.body;
		films.push(book);
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});
router.delete('/:name', (req,res) => {
	var nameValue = req.params.name;
	var statusCode;
	if (tools.removeByAttr(films,'name',nameValue) == 0) {
		statusCode = 404;
	} else {
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});

// ----------------------------------------------------------------------
function loadInitialData() {
	arr = [];
	arr.push( { name : "True Grit", year : "2011" , genre : "Western"         , runningTime : "106"    , director: "Joel & Eazan Coen" });
	arr.push( { name : "13 days"  , year : "2000" , genre : "Political-Drama" , runningTime : "148"    , director: "Roger Donalson"    });
	arr.push( { name : "Jaws"     , year : "1975" , genre : "Action/Adventure", runningTime : "2h 4min", director: "Steven Spielberg"  });
	return arr;
}

module.exports = router;