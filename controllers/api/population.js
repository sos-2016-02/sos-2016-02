var tools = require('../../tools');
var fs = require('fs');

var populationData = [];



exports.loadInitialData = (req, res) => {
    populationData = JSON.parse(fs.readFileSync('data/population_initial_data.json', 'utf8'));
    populationData.sort(compareDatumByYearAndProvince);
    res.sendStatus(200);
};

exports.postNewDatum = (req, res) => {
    var datum = req.body;
    var fieldIsMissing =
            tools.missing(datum.province) ||
            tools.missing(datum.year) ||
            tools.missing(datum.number) ||
            tools.missing(datum.birthplace) ||
            tools.missing(datum.age);
    if (fieldIsMissing) {
        res.sendStatus(400);
        return;
    }

    var filteredByProvince = tools.findAllByProperty(populationData,
                                                     'province', datum.province);
    // province and year are the primary key
    var existingDatum = tools.findByProperty(filteredByProvince, 'year', datum.year);
    if (existingDatum != undefined) {
        res.sendStatus(409); // already exist
        return;
    }

    // number is received as a string a must by persisted as an int
    datum['number'] = parseInt(datum['number'], 10);
    populationData.push(datum);
    populationData.sort(compareDatumByYearAndProvince);
    res.sendStatus(201);
};

exports.deleteAllData = (req, res) => {
    populationData = [];
    res.sendStatus(200);
};


exports.getPopulationData = (req, res) => {
    var data = populationData;
    if (req.query.minPopulation != undefined) {
        data = data.filter((datum) => {
            return datum['number'] >= req.query.minPopulation;
        });
    }
    data = tools.getInterval(data,
                             req.query.offset,
                             req.query.limit);
    res.send(data);
};


exports.getDataByProvince = (req, res) => {
    var province = req.params.province;
    var provinceData = tools.findAllByProperty(populationData, 'province', province);
    if (req.query.minPopulation != undefined) {
        provinceData = provinceData.filter((datum) => {
            return datum['number'] >= req.query.minPopulation;
        });
    }

    var paginatedData = tools.getInterval(provinceData,
                                 req.query.offset,
                                 req.query.limit);
    res.send(paginatedData);
};

exports.getDataByYear = (req, res) => {
    var year = req.params.year;
    var data = tools.findAllByProperty(populationData, 'year', year);
    if (req.query.minPopulation != undefined) {
        data = data.filter((datum) => {
            return datum['number'] >= req.query.minPopulation;
        });
    }
    var paginatedData = tools.getInterval(data,
                                          req.query.offset,
                                          req.query.limit);
    res.send(paginatedData);
};

exports.getDatum = (req, res) => {
    var province = req.params.province;
    var year = req.params.year;
    var filteredByProvince = tools.findAllByProperty(populationData, 'province', province);
    // province and year are the primary key
    var datum = tools.findByProperty(filteredByProvince, 'year', year);
    if (datum == undefined) {
        res.sendStatus(404);
    } else {
        res.send(datum);
    }
};

exports.putDatumToUpdate = (req, res) => {
    var province = req.params.province;
    var year = req.params.year;
    var filteredByProvince = tools.findAllByProperty(populationData, 'province', province);
    // province and year are the primary key
    var datum = tools.findByProperty(filteredByProvince, 'year', year);
    if (datum == undefined) {
        res.sendStatus(404);
        return;
    }

    newDatum = req.body;
    var primaryKeyIsNotTheSame =
            datum.province != newDatum.province ||
            datum.year != newDatum.year;
    if (primaryKeyIsNotTheSame) {
        res.sendStatus(400);
        return;
    }

    tools.removeByTwoProperties(populationData,
                                'province', province,
                                'year', year);
    populationData.push(newDatum);
    populationData.sort(compareDatumByYearAndProvince);
    res.sendStatus(200);
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

function compareDatumByYearAndProvince(datum1, datum2) {
    var yearComparaison = datum1.year - datum2.year;
    if (yearComparaison != 0) return yearComparaison;
    return datum1.province.localeCompare(datum2.province);
}
