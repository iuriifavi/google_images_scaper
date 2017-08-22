var express = require('express');
var router = express.Router();

const ScrapeImages = require("../scraper.js");
var {Image, Images} = require('../images.js');
Images = Images.instance;

router.get('/:label', function(req, res, next) {
  var add = Images.preLabeled(req.params.label);
  console.log(req.cookies);
  ScrapeImages(req.params.label, [], 50, req.headers.coockie)
  .then( (images) => {
    images.forEach( (x) => add(x));
    console.log(images.length);
    Images.save();
    res.json(Images.images.filter( (image) => image.is(req.params.label) ));
  } ).catch((e) => req.next(e));
});

router.post('/:label', function(req, res, next) {
  var add = Images.preLabeled(req.params.label);
  ScrapeImages(req.params.label, req.body.labels, 50, req.headers.coockie)
  .then( (images) => {
    images.forEach( (x) => add(x));
    console.log(images.length);
    Images.save();
    res.json(Images.images.filter( (image) => image.is(req.params.label) ));
  } ).catch((e) => req.next(e));
});

module.exports = router;
