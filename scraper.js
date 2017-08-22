const cheerio = require("cheerio");
const _ = require("lodash");
const Rx = require("rx");
const DownloadHtml = require("./lib/download");

function getAllUrls(q, sub) {
	let urls = [`http://images.google.com/search?q=${q}&hl=en&sout=1&tbm=isch`];
	sub.forEach( (x) => urls.push(`http://images.google.com/search?q=${x}%20${q}&hl=en&sout=1&tbm=isch`) );
	return urls;
}

async function ScrapeImages(q, sub, p) {
	var urls = _.flatMap(getAllUrls(q, sub), (url) =>
						_.range(p).map( (page) => url + `&start=${page * 20}`) );
	var headers = {
		'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
		//'Cookie': "NID=107=FB996sRD2-2xxJrWpQNiD6i5wWkZgjlcc5W1_YaAuBNwWN5IOlOt_S_epI9Np7kcMEuOHrRhjX-IiHhko4__T4ynMipVq4NQLWUwvSxkr0OXo_fNYC3oDcKN8hOy9RNm;"
	};
	var pages = urls.map((url) => DownloadHtml(url, headers) );
	var images = [];

	for (let i = 0; i < pages.length; i++) {
		try {
			var html = await pages[i];
			let $ = cheerio.load(html);
			$('img').each((i, img) => images.push(img.attribs.src));
		} catch(e) {
			console.log(">>>",e);
		}
	}

	return images;
}

module.exports = ScrapeImages;