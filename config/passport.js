var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var Administrator = require('../models/Administrator');
var Business = require('../models/Business');
var config = require('./database');
var Client = require('../models/Client')

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
                    if(err){
                        
                        return done(err, false);
                    }
                    if(business){
                        return done(null, business)
                    } else {
                        Client.getClientById(jwt_payload._doc._id,(error, client) => {
                    if(err){
                        
                        return done(err, false);
                    }
                    if(client){
                        return done(null, client)
                    } else {
                        
                    }
                })
                    }
                })
            }
        })
    }))
}