var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var Administrator = require('../models/Administrator');
var Business = require('../models/Business');
var config = require('./database');

module.exports = function(passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        Administrator.getAdministratorById(jwt_payload._doc._id, (err, admin) => {
            if (err) {
                return done(err, false);
            }
            if (admin) {
                return done(null, admin);
            } else {
                Business.getBusinessById(jwt_payload._doc._id,(error, business) => {
                    if(!err && business ){
                        return done(null, business);
                    }else{
                        return done(null, false);
                    }
                })
            }
        })
    }))
}
