var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
let Moderator = require('../models/Moderator');
router.get('/', function(req, res) {
    var moderator = new Moderator();
    moderator.username = "omar124";
    moderator.email = "ali@gmail.com";
    moderator.password = "123";
    console.log("ok");
    moderator.save(function(err, moderator) {
        if (err) {
            return res.send(err.message)
            console.log(err);
        } else {
            console.log(moderator);
            res.render('test');

        }
    })
});
module.exports = router;
