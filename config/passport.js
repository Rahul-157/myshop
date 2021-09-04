/**
 * Passport configuration file where you should configure strategies
 */
require("dotenv").config()
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const EXPIRES_IN_MINUTES = 60 * 48;
const SECRET = process.env.tokret
const ALGORITHM = "HS256";
var ISSUER = "rahul";
var AUDIENCE = "kumar";
//const logger=sails.log;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(function (id, done) {
    var existingUser = {};
    User.findOne({id: id}).exec(function (err, user) {
            if (user) {
                existingUser.userName = user ? user.firstName : "";
                existingUser.id = user ? user.id : '';
                existingUser.role = user ? user.role : '';
                existingUser.isEmailVerified = user ? user.isEmailVerified : false;
                done(err, existingUser);
            } else {
                done(null, false);
            }
        }
    );
});


/**
 * Configuration object for local strategy
 */
var LOCAL_STRATEGY_CONFIG = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};

/**
 * Configuration object for JWT strategy
 */



var JWT_SETTINGS = {
    expiresIn: '7d',
    algorithm: ALGORITHM,
    issuer:ISSUER,
    audience:AUDIENCE
};



/**
 * Triggers when user authenticates via local strategy
 */
function _onLocalStrategyAuth(req, email, password, next) {
    User.findOne({email: email})
        .exec(function (error, user) {
            if (error) return next(error, false, {});
            if (!user) return next(null, false, 'Incorrect Email!',);
            if (!CipherService.comparePassword(password, user))
                return next(null, false, 'Incorrect Password!');
            return next(null, user, {});
        });
}

/**
 * Triggers when user authenticates via JWT strategy
 */
function _onJwtStrategyAuth(payload, next) {
    var user = payload.user;
    return next(null, user, {});
}
passport.use(
    new LocalStrategy(LOCAL_STRATEGY_CONFIG, _onLocalStrategyAuth));
    
passport.use(
    new JwtStrategy(SECRET, _onJwtStrategyAuth));

module.exports.jwtSettings = JWT_SETTINGS;
