var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database')
var Administrator = require('../models/Administrator')
var Moderator = require('../models/Moderator')

var Business = require('../models/Business')
var Admin = require('../models/Administrator')
var Request = require('../models/Request')
var ObjectId = require('mongodb').ObjectID;
//--------------(to be removed)----------

router.get('/admins', function(req, res) {
    Admin.find({}, function(err, admins) {
        var adminMap = {};

        admins.forEach(function(admin) {
            admin.populate("theAdmin");
            adminMap[admin._id] = admin;
        });

        res.send(adminMap);
    });
});

//---------------------------------------

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'scriptaholics@gmail.com',
        pass: 'secourse2017'
    }
});
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});


//Register
router.post('/register', function(req, res, next) {
    let newAdmin = new Administrator({
        username: req.body.username,
        password: req.body.password,
        isSuper: req.body.isSuper
    });

    Administrator.addAdmin(newAdmin, (err, admin) => {
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to register admin'
            });
        } else {
            res.json({
                success: true,
                msg: 'Admin registered'
            });
        }
    })
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    Administrator.getAdministratorByUsername(username, (err, admin) => {
        if (err) throw err;
        if (!admin) {
            return res.json({
                success: false,
                msg: 'Admin not found'
            });
        }

        Administrator.comparePassword(password, admin.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                var token = jwt.sign(admin, config.secret, {
                    expiresIn: 604800 //1 week
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    admin: {
                        id: admin._id,
                        username: admin.username,
                        isSuper: admin.isSuper
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
});

//Get unregistered Moderators
router.get('/unregmoderators', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    Moderator.find({
        'status': 'unregistered'
    }, (err, moderators) => {
        if (err) {
            res.json({
                success: false
            })
        } else {
            res.json({
                success: true,
                moderators: moderators
            })
        }
    })
})

//Update unregistered moderator status

router.post('/addModerator', passport.authenticate('jwt', {

    session: false
}), (req, res, next) => {
    if (req.body.status == "accepted") {
        Moderator.findOne({
            'business_number': req.body.business_number
        }, (err, moderator) => {
            if (err) {
                res.json({
                    success: false
                })
            } else {

                console.log(moderator)
                let newBusiness = new Business({
                    username: moderator.business_name.concat("#", moderator.business_number),
                    password: moderator.business_number,
                    email: moderator.email,
                    bank_account: moderator.bank_account,
                    name: moderator.business_name,
                    location: moderator.business_location,
                    business_number: moderator.business_number,
                    type: moderator.business_type,
                })

                Business.addBusiness(newBusiness, (err) => {
                    if (err) {
                        console.log(err);

                        res.json({
                            success: false
                        })
                    } else {

                        Moderator.update({
                            'business_number': req.body.business_number
                        }, {
                            $set: {
                                'status': 'accepted'
                            }
                        }, (err) => {
                            if (err) {
                                res.json({
                                    success: false
                                })
                            } else {
                                //console.log(newBusiness.email)
                                // setup email data with unicode symbols
                                let mailOptions = {
                                    to: newBusiness.email,
                                    subject: 'Confirmation',
                                    text: 'Username: '.concat(newBusiness.username, ', Password: ' + moderator.business_number)
                                };

                                // send mail with defined transport object
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    console.log('Message %s sent: %s', info.messageId, info.response);
                                });
                                res.json({
                                    success: true
                                })
                            }

                        })
                    }
                })
            }
        })
    } else {
        Moderator.update({
            'business_number': req.body.business_number
        }, {
            $set: {
                'status': 'rejected'
            }
        }, (err) => {
            if (err) {
                res.json({
                    success: false
                })
            } else {
                res.json({
                    success: true
                })
            }
        })
    }
})



//Remove Moderator
router.post('/removeModerator', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Business.findOne({
        username: req.body.username
    }, (err, business) => {
        if (err) {
            res.json({
                success: false
            })
        } else {
            Moderator.update({
                business_number: business.business_number
            }, {
                $set: {
                    'status': 'removed'
                }
            }, (err) => {
                if (err) {
                    res.json({
                        success: false
                    })
                } else {
                    Business.remove({
                        username: req.body.username
                    }, (err) => {
                        if (err) {
                            res.json({
                                success: false
                            })
                        } else {
                            res.json({
                                success: true
                            })
                        }
                    })
                }
            })
        }
    })
})

//Notify Moderators
router.post('/notify', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    for (i = 0; i < req.body.businesses.length; i++) {
        console.log(req.body.businesses[i])
        Business.update({
            'username': req.body.businesses[i]

        }, {
            $push: {
                notifications: req.body.notification
            }
        }, (err) => {
            if (err) {
                res.json({
                    success: false
                })
            } else {
                res.json({
                    success: true
                })
            }
        })
    }
})


//Add admins as Super Administrator
router.post('/addAdmin', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    if (req.user.isSuper) {
        console.log(req.user.username)
        let newAdmin = new Administrator({
            username: req.body.username,
            password: req.body.password,
            isSuper: req.body.isSuper
        });

        Administrator.addAdmin(newAdmin, (err, admin) => {
            if (err) {
                res.json({
                    success: false,
                    msg: 'Failed to add admin'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'Admin added'
                });
            }
        })
    } else {
        res.json({
            success: false,
            msg: 'Not a super admin'
        })
    }
})

//Remove admin as Super Asministrator
router.post('/removeAdmin', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    if (req.user.isSuper) {
        Administrator.remove({
            username: req.body.username
        }, (err) => {
            if (err) {
                res.json({
                    success: false,
                    msg: 'Failed to remove admin'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'Admin removed'
                });
            }
        })
    } else {
        res.json({
            success: false,
            msg: 'Not a super admin'
        })
    }
})

//View Requests
router.get('/viewRequests', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Request.find({}, (err, requests) => {
        if (err) {
            res.json({
                success: false
            })
        } else {
            res.json({
                success: true,
                requests: requests
            })
        }
    })
})
//View Pending Requests
router.get('/viewRequestsPend', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Request.find({
        status: "pending"
    }, (err, requests) => {
        if (err) {
            res.json({
                success: false
            })
        } else {
            res.json({
                success: true,
                requests: requests
            })
        }
    })
})

//Update Request
router.post('/updateRequest', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Request.findOne({
        business_id: req.body.business_id
    }, (err, request) => {
        if (err) {
            res.json({
                success: false
            })
        } else {
            if (req.body.status == "accepted") {
                Business.update({
                    _id: ObjectId(req.body.business_id)
                }, {
                    $set: {
                        bank_account: request.new_bank_account
                    }
                }, (err) => {
                    if (err) {
                        res.json({
                            success: false
                        })
                    } else {
                        Request.update({
                            business_id: req.body.business_id
                        }, {
                            $set: {
                                status: "accepted"
                            }
                        }, (err) => {
                            if (err) {
                                res.json({
                                    success: false
                                })
                            } else {
                                res.json({
                                    success: true
                                })
                            }
                        })
                    }
                })
            } else {
                Request.update({
                    business_id: req.body.business_id
                }, {
                    $set: {
                        status: "rejected"
                    }
                }, (err) => {
                    if (err) {
                        res.json({
                            success: false
                        })
                    } else {
                        res.json({
                            success: true
                        })
                    }
                })
            }
        }
    })
})

module.exports = router;
