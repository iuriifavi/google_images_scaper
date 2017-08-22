var express = require('express');
var router = express.Router();

var {Image, Images} = require('../images.js');
Images = Images.instance;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json(Images.labels);
});

router.get('/fix', function(req, res, next) {
    res.json(Images.fix());
});

router.post('/diff', function(req, res, next) {
    var r = {};
    r.has = Images.labels;
    r.diff = Images.diff(req.body.labels);
    res.json(r);
});

router.post('/', function(req, res, next) {
    Images.newLabel(req.body.label);
    Images.save();
    res.json(Images.labels);
});

router.put('/', function(req, res, next) {
    Images.renameLabels(req.body.oldLabel, req.body.newLabel);
    Images.save();
    res.json(Images.labels);
});

router.delete('/', function(req, res, next) {
    Images.removeLabels(req.body.label);
    Images.save();
    res.json(Images.labels);
});

module.exports = router;
