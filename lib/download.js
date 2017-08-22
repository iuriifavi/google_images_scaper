const req = require("tinyreq");

function DownloadHtml(url, headers) {
	return new Promise( (resolve, reject) => {
		var params = headers ? { url: url, headers: headers } : url;
		req(params ,function (err, html) {
			if (err)
				reject(err)
			else
				resolve(html)
		});
	});
}

module.exports = DownloadHtml