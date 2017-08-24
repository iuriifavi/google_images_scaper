const req = require("tinyreq");

function DownloadData(url, headers) {
	return new Promise( (resolve, reject) => {
		var params = headers ? { url: url, headers: headers } : url;
		req(params ,function (err, data) {
			if (err)
				reject(err)
			else
				resolve(data)
		});
	});
}

module.exports = DownloadData