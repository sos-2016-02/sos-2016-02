var tools = require('../../tools');
var fs = require('fs');
var passport = require('passport');
LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy;

var populationData = [];

passport.use(new LocalAPIKeyStrategy(
    function(apikey, done) {
        if (apikey == 'correct-key-1' ||
            apikey == 'correct-key-2') {
            return done(null, true);
        } else {
            return done(null, false);
        }
    }
));

exports.checkAuthentication = (req, res, next) => {
    passport.authenticate('localapikey', function(err, user, info) {
        if (user == false) {
            return res.sendStatus(401);
        }
        return next();
    })(req, res, next);
};


exports.loadInitialData = (req, res) => {
    populationData = JSON.parse(fs.readFileSync('data/population_initial_data.json', 'utf8'));
    res.sendStatus(200);
};

exports.postNewDatum = (req, res) => {
    var datum = req.body;
    var fieldIsMissing =
            datum.province == undefined ||
            datum.year == undefined ||
            datum.number == undefined;

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
    res.sendStatus(201);
};

exports.deleteAllData = (req, res) => {
    populationData = [];
    res.sendStatus(200);
};


exports.getPopulationData = (req, res) => {
    var data = tools.getInterval(populationData,
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
    res.send(data);
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
