var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
let Moderator = require('../models/Moderator');
let Administrator = require('../models/Administrator');
var username;
router.get('/', function(req, res) {
    res.render('test');
});

router.get('/success', function(req, res) {
    res.render('success');
});
router.get('/fail', function(req, res) {
    res.render('fail');
});

module.exports = router;
