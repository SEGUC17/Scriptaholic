var express = require('express');
var router = express.Router();
var Client = require('../models/Client');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Event = require('../models/Event');
var Booking = require('../models/Booking');
var Business = require('../models/Business');
var jwt = require('jsonwebtoken');
var config = require('../config/database')
var Activity = require('../models/Activity');
var date = require('date-and-time');
var businessTitle;



//Register
router.post('/register', function(req, res, next) {
    let newClient = new Client({
        username: req.body.username,
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    Client.addClient(newClient, (err, admin) => {
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to register client'
            });
        } else {
            res.json({
                success: true,
                msg: 'Client registered'
            });
        }
    })
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    Client.getClientByUsername(username, (err, client) => {
        if (err) throw err;
        if (!client) {
            return res.json({
                success: false,
                msg: 'Client not found'
            });
        }

        Client.comparePassword(password, client.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                var token = jwt.sign(client, config.secret, {
                    expiresIn: 604800 //1 week
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    client: client
                });
            } else {
                return res.json({
                    success: false,
                    msg: 'Wrong password'
                });
            }
        })
    })
});


router.post('/booking/event', passport.authenticate('jwt', {
    session: false
}), function(req, res) {



    var event_id = req.body.event_id;
    var client_id = req.user.id;








    Event.findOne({
        _id: event_id
    }, function(err, event) {
        if (event.capacity == 0) {
            console.log('cant do booking');
            return;
        } else {


            var newBooking = new Booking();
            newBooking.client_id = client_id;
            newBooking.business_id = event.business_id;
            newBooking.event_id = event_id;
            newBooking.booking_number = 1234;
            newBooking.isEvent = true;
            newBooking.time = event.start_date;
            newBooking.venue.city = event.venue.city;
            newBooking.venue.area = event.venue.area;
            newBooking.venue.address = event.venue.address;
            newBooking.payment = event.price;
            newBooking.save(function(err, booking) {
                if (err) throw err;
            });
            Event.update({
                _id: event_id
            }, {
                $inc: {
                    capacity: -1
                }
            }, function(err, result) {
                console.log(result);
            });




        }


    })


})


//4.7
//subscribe
router.post('/subscribe', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    console.log('dakhal'); //finds the business to be subscribed to
    Business.findOne({
        _id: req.body.business_id
    }, function(err, business) { //58e106b46d8b2f0e472661c9
        if (err) {
            throw err;
        }

        if (business) {
            console.log(business._id);
            // console.log(req.user);
            var cid = req.user.id;
            console.log(cid);
            //find the business that the client wants to subscribe to and update the subscriptions array of the client
            Client.findByIdAndUpdate({
                _id: cid
            }, {
                $push: {
                    subscriptions: business.id
                }
            }, {
                new: true
            }, function(err, client) {
                if (err) {
                    console.log('error');
                    throw err;
                }
                console.log(client);
                res.json(business);
            });
            // console.log(client);
        }
    });
});



module.exports = router;
