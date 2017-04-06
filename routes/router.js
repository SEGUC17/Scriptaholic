var express = require('express');
var moderator = require('./moderator.js');
//var user = require('./user.js');
var admin = require('./admin.js');
var client = require('./client.js');

var Business = require('../models/Business')
var Activity = require('../models/Activity')
var Event = require('../models/Event')
var Admin = require('../models/Administrator')
var Moderator = require('../models/Moderator');
var Business = require('../models/Business')


var router = express.Router();

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})


router.get('/', (req, res) => {
    res.send('HOME');
});

//--------------View All businesses and activities---------

router.get('/businesses', function(req, res) {
    Business.find({}, function(err, businesses) {
        var businessMap = {};

        businesses.forEach(function(business) {
            business.populate("theBusiness");
            businessMap[business._id] = business;
        });

        res.send(businessMap);
    });
});


router.get('/activities', function(req, res) {
    Activity.find({}, function(err, activities) {
        var activityMap = {};

        activities.forEach(function(activity) {
            activity.populate("theActivity");
            activityMap[activity._id] = activity;
        });

        res.send(activityMap);
    });
});

//------------------------------------------------------

router.use('/moderator', moderator);
//router.use('/user', user);
router.use('/admin', admin);
router.use('/client', client);
module.exports = router;
