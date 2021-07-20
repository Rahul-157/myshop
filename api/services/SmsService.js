var request = require("request");
module.exports = {
	sendSms: function (message, numbers) {
		let postData = {
			hash: 'mysecret',
			numbers: numbers,
			username: 'username',
			message: message,
			sender: 'mysndername'
		};

		let options = {
			method: 'POST',
			formData: postData,
			url: 'http://api.textlocal.in/send/',
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
			}
		};

		request.post(options, function (error, response, body) {
			if (error) {
				return false;
			} else {
				return true;
			}
		});
	}
}