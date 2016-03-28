// ============================================================================ VARIABLES DEFINITION
var tools      = require('./tools');
var bodyParser = require('body-parser');
var express    = require('express');
var router     = express.Router();
//llamar a un archivo con modulo fs
var fs = require("fs"); 

var workers = [];



router.use(bodyParser.json());


/*router.use(function(req, res, next) {
    //req.version is used to determine the version
   req.version = req.headers['accept-version'];
   next();
});

router.use('/api/v1/workers', api_workers);*/

// Cargo datos Iniiciales


router.get('/loadInitialData',function(req,res){
	var content =fs.readFileSync('data/workers_inital_data.json','utf8');
	workers = JSON.parse(content);
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

router.post('/api/v1/workers/:province', (req,res) => {
	res.sendStatus(405);
});

// GET para un identificador
router.get('/api/v1/workers/:province', (req,res) => {
	var provinceValue = req.params.province;
	if (provinceValue == "loadInitialData") {
		workers = loadInitialData();
		res.sendStatus(200);
	} else {
		var item = tools.findByAttr(workers,'province',provinceValue);
		if (item == null) {
			res.sendStatus(404);
		} else {
			res.send(item);
		}
	}
});

//PUT actualiza un registro already exist

router.put('/api/v1/workers/:province', (req,res) => {
	var provinceValue = req.params.province;
	var statusCode;
	if (tools.removeByAttr(workers,'province',provinceValue) == 0) {
		statusCode = 404;
	} else {
		var worker = req.body;
		workers.push(book);
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});

//DELETE borramos un trabajador con un especifico id 

router.delete('/api/v1/workers/:province', (req,res) => {
	var provinceValue = req.params.province;
	var statusCode;
	if (tools.removeByAttr(workers,'province',provinceValue) == 0) {
		statusCode = 404;
	} else {
		statusCode = 200;
	}
	res.sendStatus(statusCode);
});




//=========================================================



/*router.findAllWorkers = function(req,res){
	Workers.find((err,workers)=>{
		if(err)
			res.send(500, err.message);
		console.log('/api/v1/workers/');
			res.sendStatus(200);
	});

};


router.findById = function(req,res){
	Workers.findById(req.params.province,(err,workers)=>{
		if(err)
			return res.send(500,err.message);
		console.log('/api/v1/workers/',+req.params.province);
	res.sendStatus(200).jsonp(workers);
	});

};



router.addWorkers = (req,res)=>{
	console.log('POST');
	console.log(req.body);

	var workers = new Workers({
		province: req.body.province,
		year: req.body.year,
		industry: req.body.industry,
		valu: req.body.value
	});
	workers.save(function(err,workers){
		if(err)
			return res.sendStatus(500).send(err.message);
	res.sendStatus(200).jsonp(workers);
	});
};



router.upadateWorkers = (req,res)=>{
	Workers.findById(req.params.province, function(err,workers){
		workers.province = req.body.province;
		workers.year = req.body.year;
		workers.industry = req.body.industry;
		workers.value = req.body.value;


		workers.save(function(err){
			if(err)
				return res.sendStatus(500).send(err.message);

	res.sendStatus(200);
		})
	})
}



router.deleteWorkers =(req,res)=>{
	Workers.findById(req.params.province,(err,workers)=>{
		workers.remove(function(err){
			if(err)
				return res.sendStatus(500).send(err.message);
	res.sendStatus(200).send();
		})
	});
};*/


//METODO AUTENTIFICACION 

router.get('/api/v1/workers/login',function(req,res){
	var user = req.query.user;
	var password = req.query.password;

	if(user !="crileaech" || password != "sevilla2016"){
		res.writeHead(403); // forbiden

	}else{
		res.setHeader('access-token',"You are welcome");
		res.writeHead(200);
	}
	res.end;
});

module.exports = router;