var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
var express = require('express');
var router = express.Router();
var controller = require('./controllers/api/population.js');

module.exports = router;

router.use(bodyParser.json());
router.use(passport.initialize());
router.use(cors());

router.get('/loadInitialData', controller.checkAuthentication, (req,res) => controller.loadInitialData(req, res) );

// on collection
router.get('/', controller.checkAuthentication, (req, res) => controller.getPopulationData(req, res));
router.post('/', controller.checkAuthentication, (req, res) => controller.postNewDatum(req, res));
router.put('/', controller.checkAuthentication, (req, res) => res.sendStatus(405));
router.delete('/', controller.checkAuthentication, (req, res) => controller.deleteAllData(req, res));

// on a subset of collection
router.get('/:province(\\D+)/', controller.checkAuthentication, (req, res) => controller.getDataByProvince(req, res));
router.get('/:year(\\d+)/', controller.checkAuthentication, (req, res) => controller.getDataByYear(req, res));

// on individual ressources
router.get('/:province/:year', controller.checkAuthentication, (req, res) => controller.getDatum(req, res));
router.put('/:province/:year', controller.checkAuthentication, (req, res) => controller.putDatumToUpdate(req, res));
router.delete('/:province/:year', controller.checkAuthentication, (req, res) => controller.deleteDatum(req, res));
router.post('/:province/:year', controller.checkAuthentication, (req, res) => res.sendStatus(405));
