var tools = require('./tools');
var express = require('express');
var router = express.Router();

var linuxDistributions = [];

router.get('/loadInitialData', (req, res) => {
    linuxDistributions = [{ name: 'Debian', url: 'https://www.debian.org/' },
                          { name: 'Arch Linux', url: 'https://www.archlinux.org/' },
                          { name: 'Antergos', url: 'https://antergos.com/' }
                         ];
    res.sendStatus(200);
});

// --------------------------------------------------
router.post('/', (req,res) => {
    var distro = req.body;
    linuxDistributions.push(distro);
    res.sendStatus(200);
});
router.get('/', (req,res) => {
    res.send(linuxDistributions);
});
router.put('/', (req,res) => {
    res.sendStatus(405);
});
router.delete('/', (req,res) => {
    linuxDistributions = [];
    res.sendStatus(200);
});

// --------------------------------------------------
router.post('/:name', (req,res) => {
    res.sendStatus(405);
});
router.get('/:name', (req,res) => {
    var name = req.params.name;
    var distro = tools.findByAttr(linuxDistributions,'name',name);
    if (distro == undefined) {
        res.sendStatus(404);
    } else {
        res.send(distro);
    }
});
router.put('/:name', (req,res) => {
    var name = req.params.name;
    if (removeByProperty(linuxDistributions, 'name', name)) {
        distro = req.body;
        linuxDistributions.push(distro);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});
router.delete('/:name', (req,res) => {
    var name = req.params.name;
    if (tools.removeByProperty(linuxDistributions, 'name', name)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
