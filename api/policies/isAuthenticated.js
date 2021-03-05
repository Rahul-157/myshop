var passport = require('passport');

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
		if (user) {
			try {
				let currentUser = await User.findOne({
					id: user.id
				});
				if (!currentUser) {
					return res.json({
						status: 'ERROR',
						message: 'User not found.',
						data: {},
					});
				}
				console.log("AUTHENTICATED USER");
				next();
			} catch (error) {
				console.log(error)
			}
			
		}
	})(req, res);
}; 