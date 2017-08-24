const fs = require('fs');
const http = require('http');

var Rx = require('rxjs/Rx');

var {Image, Images} = require('./images.js');
Images = Images.instance;

function download(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

var queue = Rx.Observable.from(Images.images.map((img) => img.src).filter((url) => {
    var fileName = "./images/" + url.slice(35) + ".jpg";
    return !fs.existsSync(fileName);
}));

var delayedQueue = queue.concatMap(url => {
    return Rx.Observable.of(url).delay(10);
    });

delayedQueue.subscribe( (url) => {
    if (url) {
        console.log(url);
        var fileName = "./images/" + url.slice(35) + ".jpg";
        download(url, fileName, (err) => !err && console.log(fileName, '...', 'done'));
    }
});