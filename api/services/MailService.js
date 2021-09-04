const logger = sails.log;
module.exports = {
	sendEmail: function (message, to,name, subject) {
		const mailjet = require ('node-mailjet').connect('68217e9092764ec4b8ba7bcb1df336c9', 'ac3f02295fdf413aaeb3679cedd09318')
		const request = mailjet.post("send", {'version': 'v3.1'}).request({
  			"Messages":[
				{
				"From": {
					"Email": "kum28ra@gmail.com",
					"Name": "Rahul"
				},
				"To": [
					{
					"Email": to,
					"Name": name
					}
				],
				"Subject": subject,
				// "TextPart": message,
				"HTMLPart": message,
				"CustomID": "MyShop"
				}
  			]
		})
		request
		.then((result) => {
			logger.info(result.body)
		})
		.catch((err) => {
			logger.info(err.statusCode)
		})
	}
};