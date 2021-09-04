var request = require('request');

module.exports = {

	notifyUser: async function (token, notificationData, title) {
		
		let notifications = {

			"to": token,
			"notification": {
				"body": notificationData.message,
				"title": title,
				"icon": "ic_notification",
			},
			"data": {
				"mydata": notificationData,
				"show_in_foreground": true
			}

		};
		
		request.post({
			uri: 'https://fcm.googleapis.com/fcm/send',
			headers: {
				'content-type': 'application/json',
				'Authorization': 'key=AAAAVuclPew:APA91bEH5zQRuqcukAOslRpX0scaA_-5iX32VzULtsgKyy3stcTdIwOlVr2WoEJ4OV6ZOhwBf8D-kp9nO--KRwdViFCcPgE0MiHVrO4TUG0DSUslF-1ENRohCPyiNurXn6qSigBB1NgJ'
			},
			json: notifications,
		}, function (err, result) {
			if (err) {
				return "Error"
			}
			if (result) {
				//console.log("Result in Push Notifications    :   ", result.body);
				return "Message Sent"
			}
		});
	}
}