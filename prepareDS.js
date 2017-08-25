const fs = require('fs');

var {Image, Images} = require('./images.js');
Images = Images.instance;

fs.copy = function (from, to) {
    this.createReadStream(from).pipe(this.createWriteStream(to));
}

fs.fileSize = function (filename) {
    try {
        const stats = this.statSync(filename)
        const fileSizeInBytes = stats.size
        return fileSizeInBytes
    } catch (err) {
        return 0;
    }
}

fs.mkdir("labels", console.log);

Images.labels.forEach( (label) => {
    fs.mkdir("labels/" + label, console.log);
})

Images.images.forEach(function(image) {
    var name = image.src.slice(35);
    var fileName = "./images/" + name + ".jpg";
    if (fs.fileSize(fileName)) {
        image.labels.forEach( (label) =>  {
            var labeledFileName = "./labels/" + label + "/" + name + ".jpg";
            fs.copy(fileName, labeledFileName);
        });
    }
}, Image);