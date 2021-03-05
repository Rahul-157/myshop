var mysql = require('mysql');

module.exports = {
	AutoDestroyOtp: function (user) {
		let con = mysql.createConnection(sails.config.connections.mySqlConnection);

		var sqlQuery = "CREATE EVENT IF NOT EXISTS OTP_TIMER_" + user.mobileNumber +
			" ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 MINUTE " +
			"DO UPDATE user set otp = 'NULL' where email = '" + user.email + "' ";

		con.query(sqlQuery, function (err, rows, fields) {
			if (err) {
				console.log("Some error has occurred whlie creating the event.");
			} else {
				console.log("OTP Timer set!");
			}
		});
	}
}