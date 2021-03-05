const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');

const valid_domains =  ["gmail.com", "yahoo.com", "hotmail.com", "aol.com", "hotmail.co.uk", "hotmail.fr", "msn.com", "yahoo.fr", "wanadoo.fr", "orange.fr", "comcast.net", "yahoo.co.uk", "yahoo.com.br", "yahoo.co.in", "live.com", "rediffmail.com", "free.fr", "gmx.de", "web.de", "yandex.ru", "ymail.com", "libero.it", "outlook.com", "uol.com.br", "bol.com.br", "mail.ru", "cox.net", "hotmail.it", "sbcglobal.net", "sfr.fr", "live.fr", "verizon.net", "live.co.uk", "googlemail.com", "yahoo.es", "ig.com.br", "live.nl", "bigpond.com", "terra.com.br", "yahoo.it", "neuf.fr", "yahoo.de", "alice.it", "rocketmail.com", "att.net", "laposte.net", "facebook.com", "bellsouth.net", "yahoo.in", "hotmail.es", "charter.net", "yahoo.ca", "yahoo.com.au", "rambler.ru", "hotmail.de", "tiscali.it", "shaw.ca", "yahoo.co.jp", "sky.com", "earthlink.net", "optonline.net", "freenet.de", "t-online.de", "aliceadsl.fr", "virgilio.it", "home.nl", "qq.com", "telenet.be", "me.com", "yahoo.com.ar", "tiscali.co.uk", "yahoo.com.mx", "voila.fr", "gmx.net", "mail.com", "planet.nl", "tin.it", "live.it", "ntlworld.com", "arcor.de", "yahoo.co.id", "frontiernet.net", "hetnet.nl", "live.com.au", "yahoo.com.sg", "zonnet.nl", "club-internet.fr", "juno.com", "optusnet.com.au", "blueyonder.co.uk", "bluewin.ch", "skynet.be", "sympatico.ca","windstream.net","mac.com","centurytel.net", "chello.nl","live.ca","aim.com","bigpond.net.au"];
module.exports = {

	validateMobileNumber: async function (mobileNumber) {
		let mobileNumberReg = /^\d{10}$/;
		if (mobileNumber.match(mobileNumberReg)) {
			return true;
		} else {
			return false;
		}
	},

	validateAlphaString: function (AlphaString) {
		let AlphaStringReg = /^[a-zA-Z ]*$/;
		if (AlphaString.match(AlphaStringReg)) {
			return true;
		} else {
			return false;
		}
	},

	validateEmail: async function (EmailString) {
		console.log(EmailString)
		let EmailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})/;
		if (EmailString.match(EmailReg)) {
			if(valid_domains.indexOf(EmailString.split('@')[1])!=-1)
			return true;
			else return false;
		} else {
			return false;
		}
	},

	validatePassword: function (password) {
		//let passwordRegex = /^(?=.*[a-z])(?=.*[0-9])[A-Za-z\\d0-9]{8,}/;
		if (password.length >= 8) {
			return true;
		} else {
			return false;
		}
	},

	// use method for Admin Login UI
	checkLogin: async function (email, password) {
		console.log("123456789", email)
		passport.use(new LocalStrategy({
				usernameField: 'email',
				passwordField: 'password'
			},
			function (email, password, done) {
				console.log("1111111111111")

				User.findOne({
					email: email
				}).exec(function (err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false, {
							message: 'Incorrect email.'
						});
					}
					bcrypt.compare(password, user.password, function (err, res) {
						if (!res)
							return done(null, false, {
								message: 'Invalid Password'
							});
						var returnUser = {
							email: user.email,
							createdAt: user.createdAt,
							id: user.id,
							firstName: user.firstName
						};
						return done(null, returnUser, {
							message: 'Logged In Successfully'
						});
					});
				});
			}
		))
	}

}