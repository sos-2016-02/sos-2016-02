var apiCtl     = require('./api_older_Ctl.js');
var bodyParser = require('body-parser');
var express    = require('express');
var router     = express.Router();

router.use(bodyParser.json());

router.get   ('/loadInitialData', (req,res) => apiCtl.loadInitialData(req, res) );

router.post  ('/', (req,res) => apiCtl.postOlders(req, res)   );
router.get   ('/', (req,res) => apiCtl.getOlders(req, res)    );
router.put   ('/', (req,res) => apiCtl.putOlders(req, res)    );
router.delete('/', (req,res) => apiCtl.deleteOlders(req, res) );

router.post  ('/:province/:year' , (req,res) => apiCtl.postResourceByProvinceYear(req, res)  );
router.get   ('/:province(\\D+)/', (req,res) => apiCtl.getResourceByProvince(req, res)       );
router.get   ('/:year(\\d+)/'    , (req,res) => apiCtl.getResourceByYear(req, res)           );
router.get   ('/:province/:year' , (req,res) => apiCtl.getResourceByProvinceYear(req, res)   );
router.put   ('/:province/:year' , (req,res) => apiCtl.putResourceByProvinceYear(req, res)   );
router.delete('/:province/:year' , (req,res) => apiCtl.deleteResourceByProvinceYear(req, res));

module.exports = router;