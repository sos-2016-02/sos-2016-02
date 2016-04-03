var bodyParser = require('body-parser');
var passport = require('passport');
var express = require('express');
var router = express.Router();
var controller = require('./controllers/api/population.js');

module.exports = router;

router.use(bodyParser.json());
router.use(passport.initialize());


router.get('/loadInitialData', (req,res) => controller.loadInitialData(req, res) );

// on collection
router.get('/', (req, res) => controller.getPopulationData(req, res));
router.post('/', controller.checkAuthentication, (req, res) => controller.postNewDatum(req, res));
router.put('/', (req, res) => res.sendStatus(405));
router.delete('/', (req, res) => controller.deleteAllData(req, res));

// on a subset of collection
router.get('/:province(\\D+)/', (req, res) => controller.getDataByProvince(req, res));
router.get('/:year(\\d+)/', (req, res) => controller.getDataByYear(req, res));

// on individual ressources
router.get('/:province/:year', (req, res) => controller.getDatum(req, res));
router.put('/:province/:year', (req, res) => controller.putDatumToUpdate(req, res));
router.delete('/:province/:year', (req, res) => controller.deleteDatum(req, res));
router.post('/:province/:year', (req, res) => res.sendStatus(405));
