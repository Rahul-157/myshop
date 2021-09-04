var passport = require('passport');
const logger = sails.log
module.exports = function (req, res, next) {
	// if(req.user){
	// 	return next();
	// }
	req.headers.authorization='JWT '+req.signedCookies.jwt
		passport.authenticate('jwt', async function (error, user, info) {
		if (error) {
			return res.serverError(error);
		}
		if (!user) {
			return res.forbidden("Please Login.")
		}
		// 
		next();
	})(req, res);
}; 