var express = require('express');
var router = express.Router();
var moderator = require('./moderator');
var administrator = require('./admin');
var passport = require('passport');
var LocalStrategprogity = require('passport-local').Strategy;
let Moderator = require('../models/Moderator');

router.use('/moderator',moderator);
router.use('/administrator',administrator);

module.exports = router;