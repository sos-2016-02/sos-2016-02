var tools = require('./tools');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var router = express.Router();
router.use(bodyParser.json());

var populationData = [];

router.get('/loadInitialData', (req, res) => {
    populationData = JSON.parse(fs.readFileSync('data/population_initial_data.json', 'utf8'));
    res.sendStatus(200);
});


router.get('/', (req, res) => {
    res.send(populationData);
});


router.post('/', (req, res) => {
    var datum = req.body;
    populationData.push(datum);
    res.sendStatus(200);
});


router.put('/', (req, res) => {
    res.sendStatus(405);
});


router.delete('/', (req, res) => {
    populationData = [];
    res.sendStatus(200);
});


router.post('/:province/:year', (req, res) => {
    res.sendStatus(405);
});


router.get('/:province(\\D+)/', (req, res) => {
    var province = req.params.province;
    var provinceData = tools.findAllByProperty(populationData, 'province', province);
    if (req.query.minPopulation != undefined) {
        provinceData = provinceData.filter((datum) => {
            return datum['number'] >= req.query.minPopulation;
        });
    }
    res.send(provinceData);
});


router.get('/:year(\\d+)/', (req, res) => {
    var year = req.params.province;
    var data = tools.findAllByProperty(populationData, 'year', year);
    res.send(data);
});


router.get('/:province/:year', (req, res) => {
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
});


router.put('/:province/:year', (req, res) => {
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
});


router.delete('/:province/:year', (req, res) => {
    if (tools.removeByTwoProperties(populationData,
                                    'province', req.params.province,
                                    'year', req.params.year)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
