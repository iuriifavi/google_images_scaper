var express = require('express');
var router = express.Router();

var {Image, Images} = require('../images.js');
Images = Images.instance;


router.get('/', function(req, res, next) {
  let labels = req.body.labels;
  var images = {};
  if (labels) {
    images = Images.images.filter( (image) => image.some(labels));
  }
  else {
    images = Images.images;
  }
  res.render('images', {images: images});
});

router.get('/:src', function(req, res, next) {
  res.json(Images.findImage(req.params.src));
});

module.exports = router;
