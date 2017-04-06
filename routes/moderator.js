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


var Booking = require('../models/Booking');
var path = require('path');
var async = require('async');
var ObjectId = require('mongodb').ObjectID;
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


//-----------------View Moderator's business and activities----------------

router.get('/myBusiness', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    Business.findOne({
        username: req.user.username
    }, function(err, business) {
        console.log(business);
        return res.send(business);
    });
})

router.get('/myActivities', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    Activity.find({
        "business_id": req.user._id
    }, function(err, activity) {
        console.log(activity);
        return res.send(activity);
    });
})


//-----------------Business and activities functions----------------

router.post('/editBusiness', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    Business.getBusinessByUsername(req.user.username, (err, business) => {
        if (err)
            throw err;
        if (!business) {
            return res.json({
                success: false,
                msg: 'Business not found'
            });
        }

        business.location = req.body.newLocation
        business.description = req.body.newDescription;
        business.name = req.body.newName;
        business.website = req.body.newWebsite;
        business.type = req.body.newType;
        business.news = req.body.newNews;
        business.payment_methods = req.body.newPayment_methods;
        // console.log(req.user);
        business.save(function(err) {
            if (err) {
                res.json({
                    success: false,
                    msg: 'Business failed to update.'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'Business updated.'
                });
            }

        });
    });
})


router.post('/addActivity', passport.authenticate('jwt', {
    session: false
}), upload.any(), function(req, res) {
    var activity = new Activity();
    activity.business_id = req.user._id;
    activity.name = req.body.name;
    activity.capacity = req.body.capacity;
    activity.startDate = new Date(2017, 3, 1);
    activity.endDate = new Date(2017, 3, 5);
    activity.price = req.body.price;
    activity.discount.originalPrice = req.body.price;

    for (var i = 0; i < req.files.length; i++) {
        var str = req.files[i].path;

        activity.images.push(str);

    }

    console.log(activity);
    console.log("Activity created.");
    activity.save(function(err, activity) {
        console.log(activity);
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to add activity.'
            });
        } else {
            res.json({
                success: true,
                msg: 'Activity created.'
            });
        }
    });

})

router.post('/activity', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    Activity.findOne({
        "business_id": req.user._id,
        "name": req.body.name
    }, function(err, activity) {
        if (err || activity == null) {
            res.json({
                success: false,
                msg: 'Failed to load activity.'
            });
        } else {
            res.json({
                success: true,
                msg: activity
            });
        }
    });
})

router.post('/activity/editActivity', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    Activity.findOne({
        "business_id": req.user._id,
        "name": req.body.name
    }, function(err, activity) {
        if (!activity) {
            res.json({
                success: false,
                msg: "Failed to find any activity to edit."
            })
        } else {
            activity.name = req.body.newName;
            activity.capacity = req.body.capacity;
            activity.price = req.body.price;
            activity.discount.actualDiscount = 0;
            activity.discount.originalPrice = req.body.price;
            activity.save(function(err) {
                if (err) {
                    res.json({
                        success: false,
                        msg: "Failed to edit " + activity.name + "."
                    });
                } else {
                    res.json({
                        success: true,
                        msg: activity.name + " updated."
                    });
                }
            })
        }
    })
});

router.post('/activity/deleteActivity', passport.authenticate('jwt', {
    session: false
}), function(req, res) {

    Activity.findOne({
        "business_id": req.user._id,
        "name": req.body.name
    }, function(err, activity) {
        if (err) {
            return res.json({
                success: false,
                msg: "Error occured while deleting the activity."
            })
        }
        activity.remove(function(err) {
            res.json({
                success: true,
                msg: "Activity " + activity.name + " was deleted."
            })
        });
    });


})



router.post('/activity/discount', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    Activity.findOne({
        business_id: req.user._id,
        name: req.body.name
    }, function(err, activity) {
        theNewDiscount = req.body.newDiscount;
        activity.discount.actualDiscount = theNewDiscount;
        activity.price = activity.discount.originalPrice - (activity.discount.originalPrice * (theNewDiscount / 100));
        activity.save(function(err) {
            if (err) {
                res.json({
                    success: false,
                    msg: "Failed to add discount to " + activity.name + "."
                });
            } else {
                res.json({
                    success: true,
                    msg: "Discount added to " + activity.name + "."
                });
            }
        })
    })

});


router.post('/activity/addPicture', passport.authenticate('jwt', {
    session: false
}), upload.any(), function(req, res) {

    Activity.findOne({
        business_id: req.user._id,
        name: req.body.name
    }, function(err, activity) {

        for (var i = 0; i < req.files.length; i++) {
            var str = req.files[i].path;
            activity.images.push(str);

        }

        console.log("/////////////////////////////////");
        console.log(activity);

        activity.save(function(err) {
            if (err) {
                res.json({
                    success: false,
                    msg: "Failed to add pictures to " + activity.name + "."
                });
            } else {
                res.json({
                    success: true,
                    msg: "Picture/s added to " + activity.name + "."
                });
            }
        })



    })

});



router.post('/activity/deletePicture', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    Activity.findOne({
        business_id: req.user._id,
        "name": req.body.name
    }, function(err, activity) {

        res.send(activity);
        console.log("hi");


        console.log(activity);

        if (activity.images.length == 0) {
            res.json({
                success: false,
                msg: "No image to delete in this activity."
            });
        }

        for (var i = 0; i < (activity.images).length; i++) {
            if (activity.images[i] == req.body.image) {
                activity.images.splice(i, 1);
                activity.save(function(err) {
                    if (err) {
                        res.json({
                            success: false,
                            msg: "Failed to delete picture from " + activity.name + "."
                        });
                    } else {
                        res.json({
                            success: true,
                            msg: "Picture deleted from " + activity.name + "."
                        });
                    }
                })
            }
        }

        res.json({
            success: false,
            msg: "This image doesn't exist."
        });


    })

});


router.get('/viewEventReservations', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Booking.find({
        'business_id': req.user._id,
        'isEvent': true
    }, function(err, bookings) {
        console.log(req.body)
        res.json(bookings);
    });
});
router.get('/viewActivityReservations', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Booking.find({
        'business_id': req.user._id,
        'isEvent': false
    }, function(err, bookings) {
        console.log(req.body)
        res.json(bookings);
    });
});



router.get('/viewReviewsRatings', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    username = req.user.username;
    Business.findOne({
        'username': username
    }, function(err, business) {
        if (err)
            console.log(err);
        res.json(business.feedback);
    });

});

router.post('/addLocation', passport.authenticate('jwt', {
    session: false
}), function(req, res) {

    username = req.user.username;
    var city = req.body.city;
    var area = req.body.area;
    var address = req.body.address;

    Business.update({
            username: username
        }, {
            $addToSet: {
                location: {
                    city: req.body.city,
                    area: req.body.area,
                    address: req.body.address
                }
            }
        },
        function(err, result) {

        });

    res.json("success");


    //res.redirect('/moderator/locations');




});

router.post('/deleteLocation', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    username = req.user.username;
    location: req.body.location;
    async.series([
        function(callback) {
            Business.findOne({
                username: username
            }, function(err, result) {
                if (err) {
                    callback(err);
                }
                currentbusiness = result;
                locations = result.location;
                callback();
            });

        },
        function(callback) {

            if (locations.length > 1) {
                Business.update({
                    username: username
                }, {
                    $pull: {
                        location: req.body.location
                    }
                }, function(err, result) {
                    if (err)
                        res.json("fail")
                    else
                        res.json("success")
                });
            } else {
                res.json("atleast 1 location must exist")
            }
        }
    ], function(err) {
        if (err) res.send(err.message);
        // res.render('index',{projects,img,currentuser});
    });




});
router.post('/editLocation', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    username = req.user.username;
    location = req.body.location;


    Business.update({
        username: username,
        location: {
            $elemMatch: location
        }
    }, {
        $set: {
            "location.$": {
                city: req.body.new_city,
                area: req.body.new_area,
                address: req.body.new_address
            }


        }
    }, function(err, result) {
        if (err)
            res.json("fail")
        else
            res.json("success")
    });
});

router.post('/setPayment', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    username = req.user.username;
    payment = req.body.payment;
    console.log(payment);
    console.log(username);
    Business.update({
        username: username
    }, {
        $addToSet: {
            payment_methods: {
                $each: payment
            }
        }
    }, function(err, result) {
        if (err)
            res.json("fail")
        else
            res.json("success")
    });


});



router.post('/moderatorentersdayandtime', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    var day = 2; // 1
    var time = 14; // 14
    var activity_name = 'dof';

    Activity.findOne({
        business_id: req.user.id,
        name: activity_name
    }, function(err, activity) {
        console.log(date.format(activity.startDate, 'ddd MMM DD YYYY'));
        var x = activity.startDate;
        while (x.getDay() != day) {
            x = date.addDays(x, 1);


        }
        console.log(date.format(x, 'ddd MMM DD YYYY'));



        for (var i = x; i <= activity.endDate; i = date.addDays(i, 7)) {
            i.setHours(time);
            console.log(i);
            //console.log(i);
            var app = {
                date: i,
                capacity: activity.capacity
            };
            console.log(app.capacity);
            Activity.update({
                business_id: req.user.id,
                name: activity_name
            }, {
                $addToSet: {
                    dates: app
                }
            }, function(err, result) {});

        }



    })
})

router.post('/moderatorentersdayandtime1', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    var duration = 2;
    var day = 2 // 1
    var startinghour = 10;
    var endhour = 20; // 14
    var activity_name = 'hazem';

    Activity.findOne({
        business_id: req.user.id,
        name: activity_name
    }, function(err, activity) {
        console.log(date.format(activity.startDate, 'ddd MMM DD YYYY'));
        var x = activity.startDate;
        while (x.getDay() != day) {
            x = date.addDays(x, 1);


        }
        console.log(date.format(x, 'ddd MMM DD YYYY'));



        for (var i = x; i <= activity.endDate; i = date.addDays(i, 7)) {
            for (var j = startinghour; j < endhour; j = j + duration) {
                var y = new Date(i.getFullYear(), i.getMonth(), i.getDay(), j, 0, 0, 0);

                var app = {
                    date: y,
                    capacity: activity.capacity
                };
                console.log(app.capacity);
                Activity.update({
                    business_id: req.user.id,
                    name: activity_name
                }, {
                    $addToSet: {
                        dates: app
                    }
                }, function(err, result) {});

            }


        }



    })



})


router.post('/addEvent', passport.authenticate('jwt', {
    session: false
}), upload.any(), (req, res) => {
    console.log(req.files);
    let event = new Event({
        business_id: req.user.id,
        type: req.body.type,
        name: req.body.name,
        event_date: Date.now(),
        venue: {
            city: req.body.city,
            area: req.body.area,
            address: req.body.address
        },
        start_date: Date.now(),
        end_date: Date.now(),
        description: req.body.description,
        capacity: req.body.capacity,
        price: req.body.price,

    })
    for (var i = 0; i < req.files.length; i++) {
        var str = req.files[i].path;
        event.images.push(str);
    }

    console.log(req.user);



    event.save((err) => {
        if (err) {
            res.json({
                success: false,
                msg: "Failed to add event."
            })
        } else {
            res.json({
                success: true,
                msg: event
            })
        }
    })
})

router.get('/getAllEvents', passport.authenticate('jwt', {
    session: false
}), (req, res) => {


    Event.find(function(err, events) {

        if (err) {
            res.send(err.message);
        } else {
            res.send(events);
            console.log(events);
        }
    })


});



router.post('/addPicture', passport.authenticate('jwt', {
    session: false
}), upload.any(), function(req, res) {

    for (var i = 0; i < req.files.length; i++) {
        var str = req.files[i].path;

        Business.update({
            username: req.user.username
        }, {
            $addToSet: {
                pictures: str
            }
        }, function(err, result) {});

    }


});


module.exports = router;
