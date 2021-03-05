module.exports = function (req, res, next) {
	if(!req.user){
		return res.forbidden("You are not allowed here! Stay back!");
	}
	if (req.user.role=='ROLE_ADMIN') {
		return next();
	} else {
		return res.forbidden("You are not allowed here! Stay back!");
	}
};