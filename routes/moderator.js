var express = require('express');
var Business = require('../models/Business')
var Activity = require('../models/Activity')
var Event = require('../models/Event')
var Admin = require('../models/Administrator')
var Request = require('../models/Request')
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database')
var Moderator = require('../models/Moderator');
var Business = require('../models/Business')
var multer = require('multer');
var upload = multer({
    dest: 'public/uploads/'
});
var path = require('path');
var async = require('async');

//Request an account
router.post('/register', (req, res) => {
    var moderator = new Moderator();
    moderator.email = req.body.email;
    moderator.bank_account = req.body.bank_account;
    moderator.business_name = req.body.business_name;
    moderator.business_number = req.body.business_number;
    moderator.business_type = req.body.business_type;
    moderator.status = 'unregistered';
    moderator.business_location = req.body.business_location;
    console.log(moderator);

    moderator.save(function(err, moderator) {
        console.log(moderator);
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to register moderator'
            });
        } else {
            res.json({
                success: true,
                msg: 'Moderator registered'
            });
        }
    });

})

//Authenticate
router.post('/authenticate', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;



    Business.getBusinessByUsername(username, (err, business) => {
        if (err) throw err;
        if (!business) {
            return res.json({
                success: false,
                msg: 'Business not found'
            });
        }

        Business.comparePassword(password, business.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                var token = jwt.sign(business, config.secret, {

                    expiresIn: 604800 //1 week
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,

                    business: {
                        business

                    }
                });
            } else {
                return res.json({
                    success: false,
                    msg: 'Wrong password'
                });
            }
        })
    })
})


//Confirm Moderator
router.post('/confirm', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    let business = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        name: req.body.business_name,
        type: req.body.type,
        location: req.body.business_location
    }
    Business.updateBusiness(req.user.username, business, (err) => {
        if (err) {
            res.json({
                success: false
            })
        } else {
            res.json({
                success: true
            })
        }

    });
});


//Request to change bank account
router.post('/editBankAccount', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    let request = new Request({
        business_id: req.user._id,
        new_bank_account: req.body.bank_account,
        status: "pending"
    })

    request.save((err, request) => {
        console.log(request)
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to send request'
            })
        } else {
            res.json({
                success: true
            })
        }
    })
})




module.exports = router;
