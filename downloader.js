const fs = require('fs');
const http = require('http');
const path = require('path');

function DownloadImage(url, path) {
	var file = fs.createWriteStream(path);
	var request = http.get(url, (response) => {
		console.log(url);
		response.on('data', (data) => file.write(data) ).on('end', () => file.end());
	}).on('error', (err) => fs.unlink(path) );
}

function GetFileSaver(subDir) {
	var dir = path.join('data', subDir);

	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}

	return (url, someValue) => {
		DownloadImage(url, path.join(dir, someValue.toString()));
	}
}

module.exports = { DownloadImage: DownloadImage, GetFileSaver: GetFileSaver };