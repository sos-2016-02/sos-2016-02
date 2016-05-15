var apiCtl     = require('./controllers/api/olders.js');
var bodyParser = require('body-parser');
var express    = require('express');
var request    = require('request');
var cors       = require('cors');
var router     = express.Router();

router.use(bodyParser.json());

router.use(cors());

router.get   ('/loadInitialData', (req,res) => apiCtl.loadInitialData(req, res) );

// on collection
router.post  ('/', (req,res) => apiCtl.postOlders(req, res)   );
router.get   ('/', (req,res) => apiCtl.getOlders(req, res)    );
router.put   ('/', (req,res) => apiCtl.putOlders(req, res)    );
router.delete('/', (req,res) => apiCtl.deleteOlders(req, res) );

// on a subset of collection
router.get   ('/:province(\\D+)/', (req,res) => apiCtl.getResourceByProvince(req, res)       );
router.get   ('/:year(\\d+)/'    , (req,res) => apiCtl.getResourceByYear(req, res)           );

// on individual ressources
router.post  ('/:province/:year' , (req,res) => apiCtl.postResourceByProvinceYear(req, res)  );
router.get   ('/:province/:year' , (req,res) => apiCtl.getResourceByProvinceYear(req, res)   );
router.put   ('/:province/:year' , (req,res) => apiCtl.putResourceByProvinceYear(req, res)   );
router.delete('/:province/:year' , (req,res) => apiCtl.deleteResourceByProvinceYear(req, res));

module.exports = router;