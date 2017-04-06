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

router.post('/booking/activity', passport.authenticate('jwt', {
    session: false
}), function(req, res) {

    var activity_id = req.body.activity_id;
    var client_id = req.user.id;
    var date1 = new Date(2017, 3, 4, 14, 0, 0);




    Activity.findOne({
        _id: activity_id,
        dates: {
            $elemMatch: {
                date: date1
            }
        }
    }, function(err, activity) {


        for (var i = 0; i < activity.dates.length; i++) {
            if (activity.dates[i].date.getTime() == date1.getTime()) {

                if (activity.dates[i].capacity != 0) {
                    Activity.update({
                            _id: activity.id,
                            "dates.date": date1
                        }, {
                            $inc: {
                                "dates.$.capacity": -1
                            }
                        }, {
                            new: true
                        },
                        function(err, result) {
                            if (err) {
                                throw err;
                            }

                            console.log(result);
                        });

                    var newBooking = new Booking();
                    newBooking.client_id = client_id;
                    newBooking.business_id = activity.business_id;
                    newBooking.activity_id = activity_id;
                    newBooking.booking_number = 1232424;
                    newBooking.isEvent = false;
                    newBooking.time = date1;
                    newBooking.payment = activity.price;
                    newBooking.save(function(err, booking) {
                        if (err) throw err;
                    });




                } else {
                    console.log('full');
                }

            }
        }


    })

})

router.post('/deleteBookings', passport.authenticate('jwt', {
    session: false
}), function(req, res) {

    //var id = req.body.id;
    var client_id = req.user.id;
    var booking_id = req.body.booking_id;

    Booking.findOne({
        _id: booking_id
    }).exec(function(err, booking) { //58e62e8558a630147052eaf7


        if (err) {
            //console.log('sjsjs');
            return res.json(err);
        }
        //58e610e9d4a28e0b8cb9722d
        //2017-04-06T09:56:57.723Z
        //58e610e9d4a28e0b8cb9722e

        if (booking)


        { //removes booking from the database
            //console.log(booking);
            //console.log('true');
            //not convinced be req.body.date bas sm3na kalam gemmo bas kdsa
            Activity.update({
                    _id: booking.activity_id,
                    "dates.date": booking.time
                }, {
                    $inc: {
                        "dates.$.capacity": 1
                    }
                }, {
                    new: true
                },
                function(err, result) {
                    if (err) {
                        throw err;
                    }

                    console.log(result);
                });


            booking.remove();
            //console.log('remo');

        } else {
            //return res.json(err);
        }
    });




})



module.exports = router;
