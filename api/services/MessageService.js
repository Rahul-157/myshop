require('dotenv').config();

const hostname = process.env.mode=='testing'?'http://localhost:1339/':"myhosteddomain"
module.exports = {
	otp_msg: function (otp,id) {
		let msg = "Use OTP <b> " + otp + "</b> to validate your account\
		<br>\
		You can also click <a href='"+hostname+"validate_me/"+id+"'>here</a>";
		return msg;
	}
}