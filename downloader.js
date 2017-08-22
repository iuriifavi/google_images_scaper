const fs = require('fs');
const http = require('http');
const path = require('path');

function DownloadImage(url, path) {
	console.log(url);
	var file = fs.createWriteStream(path);
	var request = http.get(url, (response) => {
		response.pipe(file);
		file.on('finish', function() {
	      file.close();
	    });
	}).on('error', (err) => fs.unlink(path) );
}

function GetFileSaver(subDir) {
	var dir = path.join('data', subDir);

	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}

	return (url, someValue) => {
		downloadImage(url, path.join(dir, someValue.toString()));
	}
}

module.exports = { DownloadImage: DownloadImage, GetFileSaver: GetFileSaver };