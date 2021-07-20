const logger = sails.log
module.exports = function (req, res, next) {
	logger.log(req.user)
	if (req.user && req.user.isEmailVerified=="1") {
		return next();
	} else {
		return res.json({
			status: "ERROR",
			message: "Your Email is not verified.",
			data: {}
		});
	}
};