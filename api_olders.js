// ============================================================================ VARIABLES DEFINITION
var tools      = require('./tools');
var bodyParser = require('body-parser');
var express    = require('express');
var router     = express.Router();

router.use(bodyParser.json());



module.exports = router;