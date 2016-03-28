// ============================================================================ VARIABLES DEFINITION
var tools      = require('./tools');
var bodyParser = require('body-parser');
var express    = require('express');
var keyWrite   = "keyWrite";
var keyRead    = "keyRead";
var router     = express.Router();
var data       = [];

var data = tools.readJSONfromFile('data/olders_initial_data.json');

router.use(bodyParser.json());

// ============================================================================ LOAD INITIAL DATA
router.get('/loadInitialData', (req,res) => {
	data = tools.readJSONfromFile('data/olders_initial_data.json');
	res.sendStatus(200);
});

// ============================================================================ ACCESS TO URL BASE
router.post('/', (req,res) => {
	if (!tools.checkApiKey(req, keyWrite)) { return res.sendStatus(401); }
	var body = req.body;
	var arrayJSON = [];
	var arrayAUX  = [];
	var provinceValue;
	var yearValue;
	if (body.length == undefined) { // Si envían {} convertirlo en [{}]
		arrayJSON.push(body);
	} else {
		arrayJSON = body;
	}
	for(var i=0; i<arrayJSON.length; i++){
        var objJSON = arrayJSON[i];
        var contentData = false;
        for(var key in objJSON){
        	contentData = true;
            var attrName = key;
            var attrValue = objJSON[key];
			if ( ['year', 'province', 'men', 'women'].indexOf(attrName) == -1) // Validador de campos
			{
				return res.sendStatus(400);
			} else {
				if (attrName=='province') { provinceValue = attrValue; }
				if (attrName=='year')     { yearValue     = attrValue; }
			}
		}
		if(!contentData) {
			return res.sendStatus(400);	
		}
		if  (  tools.findAllByTwoProperties(data    , 'province', provinceValue, 'year', yearValue).length > 0
			|| tools.findAllByTwoProperties(arrayAUX, 'province', provinceValue, 'year', yearValue).length > 0
			) // Verificar duplicidades sobre el array de datos y sobre el vector aux.
		{
			return res.sendStatus(409);
		} else {
			arrayAUX.push(objJSON);
		}
    }
    Array.prototype.push.apply(data, arrayAUX);
	return res.sendStatus(201);
});

/*
router.post('/', (req,res) => {
	if (!tools.checkApiKey(req, keyWrite)) { return res.sendStatus(401); }
	var item = req.body;
	console.log(item);
	console.log(item.length);
	for()
	var statusCode;
	if (  var item = req.body;
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
*/

router.get('/', (req,res) => {
	if (!tools.checkApiKey(req, keyRead)) { return res.sendStatus(401); }
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
	if (!tools.checkApiKey(req, keyWrite)) { return res.sendStatus(401); }
	data = [];
	res.sendStatus(200);
});

// ============================================================================ ACCESS TO RESOURCE
router.post('/:province/:year', (req, res) => {
	res.sendStatus(405);
});
router.get('/:province(\\D+)/', (req, res) => {
	if (!tools.checkApiKey(req, keyRead)) { return res.sendStatus(401); }
	var provinceId   = req.params.province;
	var filteredData = tools.findAllByProperty(data, 'province', provinceId);
	if (filteredData.length > 0) {
		var minValue = (req.query.from == undefined) ? undefined : Number(req.query.from);
		var maxValue = (req.query.to   == undefined) ? undefined : Number(req.query.to);
		filteredData = tools.findAllByRange(filteredData, 'year', minValue, maxValue);
		res.send(filteredData);
	} else {
		res.sendStatus(404);
	}
});
router.get('/:year(\\d+)/', (req, res) => {
	if (!tools.checkApiKey(req, keyRead)) { return res.sendStatus(401); }
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
	if (!tools.checkApiKey(req, keyRead)) { return res.sendStatus(401); }
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
	if (!tools.checkApiKey(req, keyWrite)) { return res.sendStatus(401); }
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
	if (!tools.checkApiKey(req, keyWrite)) { return res.sendStatus(401); }
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