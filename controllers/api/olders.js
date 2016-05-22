var tools    = require('../../tools.js');

var data = tools.readJSONfromFile('data/olders_initial_data.json');

exports.loadInitialData = function (req,res) {
	data = tools.readJSONfromFile('data/olders_initial_data.json');
	res.sendStatus(200);
};

exports.postOlders = function (req,res) {
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
		if(!contentData) {  // Supongamos que no se envían dato alguno
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
};

exports.getOlders = function (req,res) {
	var subData = data;
	subData = tools.findAllByMapProperties(subData,req.query);
	subData = tools.selectFields(subData,req.query.fields);
	subData = tools.getInterval(subData,req.query.offset,req.query.limit);
	//tools.sortJsonArrayByProperty(subData, 'province');
	res.send(subData);
};

exports.putOlders = function (req,res) {
	res.sendStatus(405);
};

exports.deleteOlders = function (req,res) {
	data = [];
	res.sendStatus(200);
};

// ============================================================================ ACCESS TO RESOURCE
exports.postResourceByProvinceYear = function (req,res) {
	res.sendStatus(405);
};

exports.getResourceByProvince = function (req,res) {
	var provinceId   = req.params.province;
	var filteredData = tools.findAllByProperty(data, 'province', provinceId);
	if (filteredData.length > 0) {
		var minValue = (req.query.from == undefined) ? undefined : Number(req.query.from);
		var maxValue = (req.query.to   == undefined) ? undefined : Number(req.query.to);
		filteredData = tools.findAllByRange(filteredData, 'year', minValue, maxValue);
		filteredData = tools.getInterval(filteredData,req.query.offset,req.query.limit);
		res.send(filteredData);
	} else {
		res.sendStatus(404);
	}
};

exports.getResourceByYear = function (req,res) {
	var yearId       = req.params.year;
	var filteredData = tools.findAllByProperty(data, 'year', yearId);
	    filteredData = tools.getInterval(filteredData,req.query.offset,req.query.limit);
	if (filteredData.length > 0)
	{
		res.send(filteredData);
	} else {
		res.sendStatus(404);
	}
};

exports.getResourceByProvinceYear = function (req,res) {
	var provinceId   = req.params.province;
	var yearId       = req.params.year;
	var filteredData = tools.findAllByTwoProperties(data, 'province', provinceId, 'year', yearId);
	    filteredData = tools.getInterval(filteredData,req.query.offset,req.query.limit);
	if (filteredData.length > 0)
	{
		res.send(filteredData);
	} else {
		res.sendStatus(404);
	}
};

exports.putResourceByProvinceYear = function (req,res) {
	var provinceId = req.params.province;
	var yearId     = req.params.year;
	var item       = req.body;
	var statusCode;
	if(item["province"]!=provinceId || item["year"]!=yearId) {
		statusCode = 400;
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
};

exports.deleteResourceByProvinceYear = function (req,res) {
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
};