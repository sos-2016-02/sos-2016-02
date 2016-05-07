var tools      = require('./tools');
var bodyParser = require('body-parser');
var express    = require('express');
//llamar a un archivo con modulo fs
var fs = require('fs'); 
var router     = express.Router();
router.use(bodyParser.json());
var workersData =[];


/*function loadInitialData() {
    arr = [];
    arr.push( { province: "Albacete", year : "2015" , industry : "Agriculture" , value : "17.0"});
    arr.push( { province: "Asturias", year : "2014" , industry : "Agriculture" , value : "13.8"});
    arr.push( { province: "Barcelona", year : "2015" , industry : "Building" , value : "132.1"});
    arr.push( { province: "Bizkaia", year : "2013" , industry : "Services" , value : "369.4"});
    arr.push( { province: "Burgos", year : "2013" , industry : "Agriculture" , value : "9.2"});
    arr.push( { province: "Ciudad Real", year : "2012" , industry : "Factories Industries " , value : "29.2"});
    arr.push( { province: "Sevilla", year : "2015" , industry : "Building" , value : "50.0"});
    
    return arr;
}*/

router.get('/loadInitialData', (req, res) => {
	var apiKey = req.query.apikey;
    if(!(apiKey == "sos")){
        res.sendStatus(403);
   
        
    }else{
        res.sendStatus(200);
        workersData = JSON.parse(fs.readFileSync('data/workers_initial_data.json', 'utf8'));

    }
    
    
    
});

router.get('/',(req, res) => {
    var data = tools.getInterval(workersData,
                                 req.query.offset,
                                 req.query.limit);
    res.send(data);
});


router.post ('/' ,(req, res) => {
	/*var apiKey = req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}*/
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
    var existingDatum = tools.findByProperty(filteredByYear, 'industry', datan.industry);
    if (existingDatum != undefined) {
        res.sendStatus(409); // already exist
        return;
    }

    workersData.push(datan);
    res.sendStatus(201);
});

router.delete('/',(req, res) => {
	/*var apiKey =req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}*/
    workersData = [];
    res.sendStatus(200);
});

router.get('/:year', (req, res) => {
	/*var apikey =req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}*/
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
	/*var apiKey =req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}*/
    var industry = req.params.industry;
    var industryData = tools.findAllByProperty(workersData, 'industry', industry);
    res.send(industryData);
});

router.get('/:year/:industry', (req, res) => {
	/*var apiKey =req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}*/
    var year = req.params.year;
    var industry= req.params.industry;
    var filteredByYear = tools.findAllByProperty(workersData, 'year', year);
    //  year and industry are the primary key
    var datan = tools.findByProperty(filteredByYear, 'industry', industry);
    if (datan == undefined) {
        res.sendStatus(404);
    } else {
        res.send(datan);
    }
});

router.post('/:year/:industry', function (req,res) {
	res.sendStatus(405);
});


router.put ('/:year/:industry', (req, res) => {
	/*var apiKey =req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}*/
    var year = req.params.year;
    var industry = req.params.industry;
    var filteredByYear = tools.findAllByProperty(workersData, 'year', year);
    //  year and industry are the primary key
    var datum = tools.findByProperty(filteredByYear, 'industry', industry);
    if (datum == undefined) {
        res.sendStatus(404);
        return;
    }

    nuevoDato = req.body;
    var clavePrimariaNoLaMisma =
            datum.year != nuevoDato.year ||
            datum.industry != nuevoDato.industry;
    if (clavePrimariaNoLaMisma) {
        res.sendStatus(400);
        return;
    }

    tools.removeByTwoProperties(workersData,
                                'year', year,
                                'industry', industry);
    workersData.push(nuevoDato);
    res.sendStatus(200);
});

router.delete('/:year/:industry', (req, res) => {
	/*var apiKey = req.query.apikey;
	if(!(apikey && apikey == "sos")){
		res.sendStatus(403);
	}*/
    if (tools.removeByTwoProperties(workersData,
                                    'year', req.params.year,
                                    'industry', req.params.industry)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});
module.exports = router;