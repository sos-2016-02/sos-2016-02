var apiCtl     = require('./controllers/api/olders.js');
var bodyParser = require('body-parser');
var express    = require('express');
var request    = require('request');
var cors       = require('cors');
var governify  = require('governify');
var router     = express.Router();

router.use(bodyParser.json());

// Allow external access
router.use(cors());

/*
 NameSpace     : sos-2016-02-mac
 Plan (  10)   : multiPlan_C2_sos-2016-02-mac_ag
 Plan (1000)   : multiPlan_C4_sos-2016-02-mac_ag
 */

governify.control(router, {
	  datestore  : "http://datastore.governify.io/api/v6.1/",
	  namespace  : "sos-2016-02-mac",
	  defautPath : "/api/v1"
});


// Load inital data
router.get   ('/loadInitialData', (req,res) => apiCtl.loadInitialData(req, res) );

// Request on collection
router.post  ('/', (req,res) => apiCtl.postOlders(req, res)   );
router.get   ('/', (req,res) => apiCtl.getOlders(req, res)    );
router.put   ('/', (req,res) => apiCtl.putOlders(req, res)    );
router.delete('/', (req,res) => apiCtl.deleteOlders(req, res) );

// Request on a subset of collection
router.get   ('/:province(\\D+)/', (req,res) => apiCtl.getResourceByProvince(req, res)       );
router.get   ('/:year(\\d+)/'    , (req,res) => apiCtl.getResourceByYear(req, res)           );

// Request on individual ressources
router.post  ('/:province/:year' , (req,res) => apiCtl.postResourceByProvinceYear(req, res)  );
router.get   ('/:province/:year' , (req,res) => apiCtl.getResourceByProvinceYear(req, res)   );
router.put   ('/:province/:year' , (req,res) => apiCtl.putResourceByProvinceYear(req, res)   );
router.delete('/:province/:year' , (req,res) => apiCtl.deleteResourceByProvinceYear(req, res));

module.exports = router;