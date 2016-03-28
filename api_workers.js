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
    res.send(workers);
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
/*
router.get('/req) {
  console.log(req.query);
  var page = req.query.page;
      items = req.query.items;
  page = page !== 'undefined' ? parseInt(page, 10) : undefined;
  items = items !== 'undefined' ? parseInt(items, 10) : undefined;

  //The search method will filter the data
  var searchResults = exports.search(req.query);
  //Then, I call sliceUsers(), passing the filtered data, page and items parameters
  return exports.sliceUsers(searchResults , page, items);
}*/

//===========================================================================
router.get('/:industry',function(req,res){
	var industry =req.params.industry;
	var limit = req.query.limit;
	if(limit)
		console.log("Limit:" +limit);
	else
		console.log("Limit Undefined" );
	res.send(workers[0]);
	console.log("New GET  of resource :"+workers);
	
});

//========================================================
//LOGIN FUNCTION 
/*
function login() {
  performRequest('/api/v1/workers/login', 'POST', {
    username: username,
    password: password,
    api_key_id: apiKey
  }, function(data) {
    sessionId = data.result.id;
    console.log('Logged in:', sessionId);
    getWorkers();
  });
}

function getWorkers() {
  performRequest('/api/v1/' + deckId + '/workers', 'GET', {
    session_id: sessionId,
    "_items_per_page": 100
  }, function(data) {
    console.log('Fetched ' + data.result.paging.total_items + ' workers');
  });
}

login();*/


//======================================

/*router.post('/api/v1/workers/:login',function(req,res){
	var user = req.query.user;
	var password = req.query.password;

	if(user !="crileaech" || password != "sevilla2016"){
		res.writeHead(403); // forbiden

	}else{
		res.setHeader('access-token',"You are welcome");
		res.writeHead(200);
	}
	res.end;
});*/

module.exports = router;