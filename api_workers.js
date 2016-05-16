var tools      = require('./tools');
var bodyParser = require('body-parser');
var express    = require('express');
//llamar a un archivo con modulo fs
var fs = require('fs'); 
var router     = express.Router();
router.use(bodyParser.json());
var workersData = loadInitialData();

var cors = require('cors');

var api = express();

api.use(bodyParser.json());
api.use(cors());
api.get("/api",(req,res)=>{
  res.semd({name :"gui trued",genre : "drama", year : "2013"})
});

api.listen(12345);

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

router.get("/loadInitialData",(req, res) => {
	var apikey = req.query.apikey;
    if(!(apikey && apikey == "sos")){
        res.sendStatus(403);
    }
    workersData = JSON.parse(fs.readFileSync('data/workers_initial_data.json', 'utf8'));
    res.sendStatus(200);
});

router.get('/',(req, res) => {
    var data = tools.getInterval(workersData,
                                 req.query.offset,
                                 req.query.limit);
    res.send(data);
});


router.post ('/' ,(req, res) => {
	var apikey = req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}
    var datan = req.body;
    var fieldIsMissing =
            datan.year == undefined ||
            datan.industry == undefined ||
            datan.value == undefined;

    if (fieldIsMissing) {
        res.sendStatus(400);
        return;
    }

    var filteredByYear = tools.findAllByProperty(workersData,
                                                     'year', datan.year);
    // year and province are the primary key
    var existingDatum = tools.findByProperty(filteredByYear, 'value', datan.value);
    if (existingDatum != undefined) {
        res.sendStatus(409); // already exist
        return;
    }

    workersData.push(datan);
    res.sendStatus(201);
});

router.delete('/',(req, res) => {
	var apikey =req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}
    workersData = [];
    res.sendStatus(200);
});

router.get('/:year', (req, res) => {
	var apikey =req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}
    var year = req.params.year;
    var yearData = tools.findAllByProperty(workersData, 'year', year);
    if (req.query.minWorkers  != undefined) {
        yearData = yearData.filter((datan) => {
            return datan['value'] >= req.query.minWorkers;
        });
    }
    res.send(yearData);
});

router.get('/:industry', (req, res) => {
	var apikey =req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}
    var industry = req.params.industry;
    var industryData = tools.findAllByProperty(workersData, 'industry', industry);
    res.send(industryData);
});

router.get('/:year/:value', (req, res) => {
	var apikey =req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}
    var year = req.params.year;
    var value= req.params.value;
    var filteredByYear = tools.findAllByProperty(workersData, 'year', year);
    //  year and industry are the primary key
    var datan = tools.findByProperty(filteredByYear, 'value', value);
    if (datan == undefined) {
        res.sendStatus(404);
    } else {
        res.send(datan);
    }
});

router.post('/:year/:value', function (req,res) {
	res.sendStatus(405);
});


router.put ('/:year/:industry', (req, res) => {
	var apikey =req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}
    var year = req.params.year;
    var value = req.params.value;
    var filteredByYear = tools.findAllByProperty(workersData, 'year', year);
    //  year and industry are the primary key
    var datum = tools.findByProperty(filteredByYear, 'value', value);
    if (datum == undefined) {
        res.sendStatus(404);
        return;
    }

    nuevoDato = req.body;
    var clavePrimariaNoLaMisma =
            datum.year != nuevoDato.year ||
            datum.value != nuevoDato.value;
    if (clavePrimariaNoLaMisma) {
        res.sendStatus(400);
        return;
    }

    tools.removeByTwoProperties(workersData,
                                'year', year,
                                'value', value);
    workersData.push(nuevoDato);
    res.sendStatus(200);
});

router.delete('/:year/:value', (req, res) => {
	var apikey = req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}
    if (tools.removeByTwoProperties(workersData,
                                    'year', req.params.year,
                                    'value', req.params.value)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});
module.exports = router;