const request = require('request');
const fetch = require('node-fetch');
module.exports = {

	urlShortner: async function (uri) {
		let url = 'https://api-ssl.bitly.com/v3/shorten?access_token=980d774b0892038c73ffda6ec8342d6fa6704404&longUrl=' + uri;
		const response = await fetch(url);
		const json = await response.json();
		let link = json.data.url;
		//link.replace("https", "http");
		return link;
	}
};