// ============================================================================ VARIABLES DEFINITION
var tools      = require('./tools');
var bodyParser = require('body-parser');
var express    = require('express');
//llamar a un archivo con modulo fs
var fs = require('fs'); 
var router     = express.Router();
router.use(bodyParser.json());
var workers = loadInitialData();

//==============================================

function loadInitialData() {
	arr = [];
	arr.push( { province: "Albacete", year : "2015" , industry : "Agriculture" , value : "17.0"});
	arr.push( { province: "Asturias", year : "2014" , industry : "Agriculture" , value : "13.8"});
	arr.push( { province: "Barcelona", year : "2015" , industry : "Building" , value : "132.1"});
	arr.push( { province: "Bizkaia", year : "2013" , industry : "Services" , value : "369.4"});
	arr.push( { province: "Burgos", year : "2013" , industry : "Agriculture" , value : "9.2"});
	arr.push( { province: "Ciudad Real", year : "2012" , industry : "Factories Industries " , value : "29.2"});
	arr.push( { province: "Sevilla", year : "2015" , industry : "Building" , value : "50.0"});
	
	return arr;
}

//=================================================

// Cargo datos Iniiciales

router.get('/loadInitialData', function(req,res){
	workers = JSON.parse(fs.readFileSync('data/workers_initial_data.json', 'utf8'));
	
	res.sendSatus(200);
});
//==============Peticiones de la api=================

//GET de todos los workers 

router.get('/', (req, res) => {
	var apikey = req.query.apikey;
	if(!(apikey && apikey=="sos")){
		res.sendStatus(403) // forbiden
	}else{
		
		res.send(workers);
	}

    
});


router.post('/', (req, res) => {
	var apikey = req.query.apikey;
	if(!(apikey && apikey=="sos")){
		res.sendStatus(403) // forbiden
		return //impedir que haga post 
	}
    var content = req.body;
    workers.push(content);
    res.sendStatus(201);
});


router.put('/', (req, res) => {
    res.sendStatus(405);
});


router.delete('/', (req, res) => {
	var apikey = req.query.apikey;
	if(!(apikey && apikey=="sos")){
		res.sendStatus(403) // forbiden
	}else{
		
		res.send(workers);
	}
   workers = [];
   res.sendStatus(200);
});


//===================Rutas de nuestra API en DB=========================================================

// POST insertar nuevo recurso 

router.post('/:year/:industry', (req,res) => {
	res.sendStatus(405);
});

// GET para un identificador
router.get('/:industry(\\D+/)', (req,res) => {
	var apikey = req.query.apikey;
	if(!(apikey && apikey=="sos")){
		res.sendStatus(403) // forbiden
	}else{
		
		res.send(workers);
	}
	var industryValue = req.params.industry;
	var industryData = tools.findAllByProperty(workers,'industry',industry);
	if(req.query.minIndustry !=undefined){
		workers = workers.filter((content)=>{
			return content ['number'] >= req.query.minIndustry;
		});
	}
	res.send(workers);
});
	/*hacer un for recorre todo los datos 
	si el dato.industry == industryValue lo meto en un array nuevo 
	que he creado previamente vacio. 
	Devuelvo despues del for el array con 
	todos los recursos que cumplen la condicion.*/

//GET busca recurso por año 

router.get('/:year(\\d+)/',function(req,res){
	var apikey = req.query.apikey;
	if(!(apikey && apikey=="sos")){
		res.sendStatus(403) // forbiden
	}else{
		
		res.send(workers);
	}
	var year =req.params.year;
	var content = tools.findAllByProperty(workers,'year',year);
	res.send(content);
});


// GET busca por dos ecursos determinados 


router.get('/:year/:industry', function(req,res){
	var apikey = req.query.apikey;
	if(!(apikey && apikey=="sos")){
		res.sendStatus(403) // forbiden
	}else{
		
		res.send(workers);
	}
	var year =req.params.year;
	var industry = req.params.industry;
	var findAllByYear = tools.findAllByProperty(workers,'year',year);
	var content = tools.findByProperty(findAllByYear,'industry',industry);
	if(content== undefined){
		res.sendStatus(404);
	}else{
		res.send(content);
	}
});
	

//PUT actualiza un registro already exist by to id


router.put('/:year/:industry', (req,res) => {
	var industryValue = req.params.industry;
	
	if (tools.removeByTwoProperties(workers,'industry',req.params.industry,
									'year',req.params.year)){
		content = req.body;
		workers.push(content);
		res.sendStatus(200);
	} else {
		
		res.sendStatus(404);
	}
	
});

//DELETE borramos un trabajador con un especifico id 



router.delete('/:year/:industry', (req,res) => {
	var apikey = req.query.apikey;
	if(!(apikey && apikey=="sos")){
		res.sendStatus(403) // forbiden
	}else{
		
		res.send(workers);
	}
	var statusCode;
	if (tools.removeByTwoProperties(workers,'year',req.params.year,
									'industry',req.params.industry)) {
		statusCode = 200;
	} else {
		statusCode = 404;
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
	res.sendStatus(200);
	
});

//========================================================

module.exports = router;