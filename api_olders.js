// ============================================================================ VARIABLES DEFINITION
var tools      = require('./tools');
var bodyParser = require('body-parser');
var express    = require('express');
var router     = express.Router();

router.use(bodyParser.json());

//var data = [];
var data = tools.readJSONfromFile('data/olders_initial_data.json');



// ============================================================================ LOAD INITIAL DATA
router.get('/loadInitialData', (req,res) => {
	data = tools.readJSONfromFile('data/olders_initial_data.json');
	res.sendStatus(200);
});

// ============================================================================ ACCESS TO URL BASE
router.post('/', (req,res) => {
	var item = req.body;
	var statusCode;
	if (  item["year"]     == undefined
	   || item["province"] == undefined
	   || item["men"]      == undefined
	   || item["women"]    == undefined
	   ) {
		statusCode = 400;	
	} else {
		if (tools.findAllByTwoProperties(data, 'province', item["province"], 'year', item["year"]).length > 0)
		{
			statusCode = 409;
		} else {
			data.push(item);
			statusCode = 201;
		}
	}
	res.sendStatus(statusCode);
});
router.get('/', (req,res) => {
	var subData = data;
	subData = tools.findAllByMapProperties(subData,req.query);
	subData = tools.selectFields(subData,req.query.fields);
	subData = tools.getInterval(subData,req.query.offset,req.query.limit);
	res.send(subData);
});
router.put('/', (req,res) => {
	res.sendStatus(405);
});
router.delete('/', (req,res) => {
	data = [];
	res.sendStatus(200);
});

// ============================================================================ ACCESS TO RESOURCE
router.post('/:province/:year', (req, res) => {
    res.sendStatus(405);
});
router.get('/:province(\\D+)/', (req, res) => {
    var provinceId   = req.params.province;
    var filteredData = tools.findAllByProperty(data, 'province', provinceId);
    if (filteredData.length > 0) {
        res.send(filteredData);
    } else {
        res.sendStatus(404);
    }
});
router.get('/:year(\\d+)/', (req, res) => {
    var yearId   = req.params.year;
    var filteredData = tools.findAllByProperty(data, 'year', yearId);
    if (filteredData.length > 0)
    {
        res.send(filteredData);
    } else {
        res.sendStatus(404);
    }
});
router.get('/:province/:year', (req, res) => {
    var provinceId   = req.params.province;
    var yearId       = req.params.year;
    var filteredData = tools.findAllByTwoProperties(data, 'province', provinceId, 'year', yearId);
    if (filteredData.length > 0)
    {
        res.send(filteredData);
    } else {
        res.sendStatus(404);
    }
});
router.put('/:province/:year', (req, res) => {
    var provinceId = req.params.province;
	var yearId     = req.params.year;
	var item       = req.body;
	var statusCode;
	if(item["province"]!=provinceId || item["year"]!=yearId) {
		statusCode = 409;
	} else {
	    if (tools.removeByTwoProperties(data, 'province', provinceId, 'year', yearId))
	    {
	        data.push(item);
	        statusCode = 200;
	    } else {
	        statusCode = 404;
	    }
	}
    res.sendStatus(statusCode);
});
router.delete('/:province/:year', (req, res) => {
	var provinceId = req.params.province;
	var yearId     = req.params.year;
	var statusCode;
	if (tools.removeByTwoProperties(data, 'province', provinceId, 'year', yearId))
	{
		statusCode = 200;
	} else {
		statusCode = 404;
	}
	res.sendStatus(statusCode);
});

module.exports = router;