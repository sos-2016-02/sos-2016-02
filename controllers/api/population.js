var tools = require('../../tools');
var fs = require('fs');

var populationData = [];

exports.loadInitialData = (req, res) => {
    populationData = JSON.parse(fs.readFileSync('data/population_initial_data.json', 'utf8'));
    res.sendStatus(200);
};

exports.getPopulationData = (req, res) => {
    res.send(populationData);
};

exports.postNewDatum = (req, res) => {
    var datum = req.body;
    populationData.push(datum);
    res.sendStatus(201);
};

exports.deleteAllData = (req, res) => {
    populationData = [];
    res.sendStatus(200);
};

exports.getDataByProvince = (req, res) => {
    var province = req.params.province;
    var provinceData = tools.findAllByProperty(populationData, 'province', province);
    if (req.query.minPopulation != undefined) {
        provinceData = provinceData.filter((datum) => {
            return datum['number'] >= req.query.minPopulation;
        });
    }
    res.send(provinceData);
};

exports.getDataByYear = (req, res) => {
    var year = req.params.year;
    var data = tools.findAllByProperty(populationData, 'year', year);
    res.send(data);
};

exports.getDatum = (req, res) => {
    var province = req.params.province;
    var year = req.params.year;
    var filteredByProvince = tools.findAllByProperty(populationData, 'province', province);
    // province and year can indentify one datum
    var datum = tools.findByProperty(filteredByProvince, 'year', year);
    if (datum == undefined) {
        res.sendStatus(404);
    } else {
        res.send(datum);
    }
};

exports.putDatumToUpdate = (req, res) => {
    var province = req.params.province;
    if (tools.removeByTwoProperties(populationData,
                                    'province', req.params.province,
                                    'year', req.params.year)) {
        datum = req.body;
        populationData.push(datum);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
};

exports.deleteDatum = (req, res) => {
    if (tools.removeByTwoProperties(populationData,
                                    'province', req.params.province,
                                    'year', req.params.year)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
};
