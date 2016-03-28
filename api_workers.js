// ============================================================================ VARIABLES DEFINITION
var tools      = require('./tools');
var bodyParser = require('body-parser');
var express    = require('express');

//llamar a un archivo con modulo fs
var fs = require('fs'); 
var router     = express.Router();
router.use(bodyParser.json());
var workers = [];



// Cargo datos Iniiciales

router.get('/loadInitialData',function(req,res){
	workers = JSON.parse(fs.readFileSync('data/workers_initial_data.json','utf8'));
	res.sendStatus(200);
});
//==============Peticiones de la api=================

//GET de todos los workers 

router.get('/', (req, res) => {
	var apikey = req.query.apikey;
	if(!(apikey && apikey=="api_key_id")){
		res.sendStatus(403) // forbiden
	}else{
		res.send(200);
		res.send(workers);
	}

    
});


router.post('/', (req, res) => {
    var content = req.body;
    workers.push(content);
    res.sendStatus(201);
});


router.put('/', (req, res) => {
    res.sendStatus(405);
});


router.delete('/', (req, res) => {
   workers = [];
    res.sendStatus(200);
});


//===================Rutas de nuestra API en DB=========================================================

// POST insertar nuevo recurso 

router.post('/:industry', (req,res) => {
	res.sendStatus(405);
});

// GET para un identificador
router.get('/:industry', (req,res) => {
	var industryValue = req.params.industry;
	if (industryValue == "loadInitialData") {
		workers = loadInitialData();
		res.sendStatus(200);
	} else {
		var item = tools.findByAttr(workers,'industry',industryValue);
		if (item == null) {
			res.sendStatus(404);
		} else {
			res.send(item);
		}
	}
});

//PUT actualiza un registro already exist

router.put('/:industry', (req,res) => {
	var industryValue = req.params.industry;
	var statusCode;
	if (tools.removeByAttr(workers,'industry',industryValue) == 0) {
		statusCode = 404;
	} else {
		var worker = req.body;
		workers.push(worker);
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});

//DELETE borramos un trabajador con un especifico id 

router.delete('/:industry', (req,res) => {
	var industryValue = req.params.industry;
	var statusCode;
	if (tools.removeByAttr(workers,'industry',industryValue) == 0) {
		statusCode = 404;
	} else {
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});




//=====================METODO DE PAGINACION ====================================

router.get('/workers/:industry',function(req,res){
	var industryValue =req.params.industry;
	var limit = req.query.limit;
	if(limit && offset){
		workers.splice(0,offset);
		workers.splice(limit,workers.length-limit);
	}
	res.sendStatus(workers);
	
});

//========================================================

module.exports = router;