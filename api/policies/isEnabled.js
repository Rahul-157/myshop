module.exports = function (req, res, next) {
	console.log(req.user)
	if (req.user && req.user.isEmailVerified) {
		return next();
	} else {
		return res.json({
			status: "ERROR",
			message: "Your Email is not verified.",
			data: {}
		});
	}
};