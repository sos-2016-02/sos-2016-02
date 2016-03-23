// ============================================================================ VARIABLES DEFINITION
var tools      = require('./tools');
var bodyParser = require('body-parser');
var express    = require('express');
var router     = express.Router();


router.use(bodyParser.json());

var data = [];
data = tools.readJSONfromFile('data/olders_initial_data.json');

// ============================================================================ LOAD INITIAL DATA
router.get('/loadInitialData', (req,res) => {
	data = tools.readJSONfromFile('data/olders_initial_data.json');
	res.sendStatus(200);
});

// ============================================================================ ACCESS TO URL BASE
router.post('/', (req,res) => {
	var item = req.body;
	var statusCode;
	if (tools.findAllByTwoProperties(data, 'province', item["province"], 'year', item["year"]).length > 0)
	{
		statusCode = 409;
	} else {
		data.push(item);
		statusCode = 201;
	}
	res.sendStatus(statusCode);
});
router.get('/', (req,res) => {
	res.send(data);
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

// ============================================================================ INITIAL DATA
function loadInitialData() {
arr = [];
arr.push( { "year":2015, "province":"Murcia", "men":16092, "women":15165 } );
arr.push( { "year":2015, "province":"Navarra", "men":622, "women":6078 } );
arr.push( { "year":2015, "province":"Ourense", "men":2367, "women":2105 } );
arr.push( { "year":2015, "province":"Palencia", "men":139, "women":1413 } );
arr.push( { "year":2015, "province":"Palmas", "men":10416, "women":1177 } );
arr.push( { "year":2015, "province":"Pontevedra", "men":8029, "women":7657 } );
arr.push( { "year":2015, "province":"Rioja", "men":2769, "women":278 } );
arr.push( { "year":2015, "province":"Salamanca", "men":2815, "women":2723 } );
arr.push( { "year":2015, "province":"Tenerife", "men":10063, "women":9472 } );
arr.push( { "year":2015, "province":"Segovia", "men":1511, "women":1438 } );
arr.push( { "year":2015, "province":"Sevilla", "men":20204, "women":19348 } );
arr.push( { "year":2015, "province":"Soria", "men":808, "women":792 } );
arr.push( { "year":2015, "province":"Tarragona", "men":7554, "women":7102 } );
arr.push( { "year":2015, "province":"Teruel", "men":1287, "women":1238 } );
arr.push( { "year":2015, "province":"Toledo", "men":7061, "women":6557 } );
arr.push( { "year":2015, "province":"Valencia", "men":24011, "women":2219 } );
arr.push( { "year":2015, "province":"Valladolid", "men":4444, "women":4215 } );
arr.push( { "year":2015, "province":"Zamora", "men":1509, "women":1337 } );
arr.push( { "year":2015, "province":"Zaragoza", "men":866, "women":8134 } );
arr.push( { "year":2010, "province":"Albacete", "men":4827, "women":4645 } );
arr.push( { "year":2010, "province":"Alicante", "men":19306, "women":1832 } );
arr.push( { "year":2010, "province":"Almería", "men":8212, "women":7625 } );
arr.push( { "year":2010, "province":"Álava", "men":2904, "women":2522 } );
arr.push( { "year":2010, "province":"Asturias", "men":8621, "women":8113 } );
arr.push( { "year":2010, "province":"Ávila", "men":1678, "women":1568 } );
arr.push( { "year":2010, "province":"Badajoz", "men":8787, "women":8402 } );
arr.push( { "year":2010, "province":"Baleares", "men":11186, "women":10462 } );
arr.push( { "year":2010, "province":"Barcelona", "men":51624, "women":48085 } );
arr.push( { "year":2010, "province":"Bizkaia", "men":9655, "women":8861 } );
arr.push( { "year":2010, "province":"Burgos", "men":3383, "women":3204 } );
arr.push( { "year":2010, "province":"Cáceres", "men":4587, "women":4461 } );
arr.push( { "year":2010, "province":"Cádiz", "men":15175, "women":14121 } );
arr.push( { "year":2010, "province":"Cantabria", "men":5388, "women":4922 } );
arr.push( { "year":2010, "province":"Castellón", "men":5934, "women":5658 } );
arr.push( { "year":2010, "province":"Ceuta", "men":112, "women":994 } );
arr.push( { "year":2010, "province":"CiudadReal", "men":6545, "women":6139 } );
arr.push( { "year":2010, "province":"Córdoba", "men":1013, "women":9581 } );
arr.push( { "year":2010, "province":"Coruña", "men":10021, "women":9282 } );
arr.push( { "year":2010, "province":"Cuenca", "men":2396, "women":234 } );
arr.push( { "year":2010, "province":"Gipuzkoa", "men":6053, "women":5465 } );
arr.push( { "year":2010, "province":"Girona", "men":7716, "women":6966 } );
arr.push( { "year":2010, "province":"Granada", "men":11279, "women":1052 } );
arr.push( { "year":2010, "province":"Guadalajara", "men":2578, "women":2374 } );
arr.push( { "year":2010, "province":"Huelva", "men":6156, "women":5688 } );
arr.push( { "year":2010, "province":"Huesca", "men":2129, "women":1982 } );
arr.push( { "year":2010, "province":"Jaén", "men":9073, "women":8432 } );
arr.push( { "year":2010, "province":"León", "men":4488, "women":4099 } );
arr.push( { "year":2010, "province":"Lleida", "men":4288, "women":3926 } );
arr.push( { "year":2010, "province":"Lugo", "men":2908, "women":2737 } );
arr.push( { "year":2010, "province":"Madrid", "men":61058, "women":58537 } );
arr.push( { "year":2010, "province":"Málaga", "men":17583, "women":16552 } );
arr.push( { "year":2010, "province":"Melilla", "men":1164, "women":954 } );
arr.push( { "year":2010, "province":"Murcia", "men":17078, "women":16049 } );
arr.push( { "year":2010, "province":"Navarra", "men":6202, "women":5655 } );
arr.push( { "year":2010, "province":"Ourense", "men":2743, "women":2591 } );
arr.push( { "year":2010, "province":"Palencia", "men":1627, "women":1504 } );
arr.push( { "year":2010, "province":"Palmas", "men":1214, "women":1128 } );
arr.push( { "year":2010, "province":"Pontevedra", "men":9344, "women":8801 } );
arr.push( { "year":2010, "province":"Rioja", "men":3061, "women":2858 } );
arr.push( { "year":2010, "province":"Salamanca", "men":3351, "women":324 } );
arr.push( { "year":2010, "province":"Tenerife", "men":10511, "women":9678 } );
arr.push( { "year":2010, "province":"Segovia", "men":1721, "women":1495 } );
arr.push( { "year":2010, "province":"Sevilla", "men":23007, "women":21266 } );
arr.push( { "year":2010, "province":"Soria", "men":855, "women":793 } );
arr.push( { "year":2010, "province":"Tarragona", "men":7959, "women":7376 } );
arr.push( { "year":2010, "province":"Teruel", "men":1374, "women":14 } );
arr.push( { "year":2010, "province":"Toledo", "men":7812, "women":7215 } );
arr.push( { "year":2010, "province":"Valencia", "men":25612, "women":24369 } );
arr.push( { "year":2010, "province":"Valladolid", "men":4949, "women":4397 } );
arr.push( { "year":2010, "province":"Zamora", "men":1767, "women":1633 } );
arr.push( { "year":2010, "province":"Zaragoza", "men":884, "women":8601 } );
return arr;
}

module.exports = router;