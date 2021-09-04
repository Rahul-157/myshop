var mysql = require('mysql');
const logger = sails.log
module.exports = {
	AutoDestroyOtp: function (user) {
		let con = mysql.createConnection(sails.config.connections.mySqlConnection);

		var sqlQuery = "CREATE EVENT IF NOT EXISTS OTP_TIMER_" + user.mobileNumber +
			" ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 MINUTE " +
			"DO UPDATE user set otp = 'NULL' where email = '" + user.email + "' ";

		con.query(sqlQuery, function (err, rows, fields) {
			if (err) {
				logger.error("Some error has occurred whlie creating the event.");
			} else {
				logger.info("OTP Timer set!");
			}
		});
	}
}