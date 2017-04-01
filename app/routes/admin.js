var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
let Moderator = require('../models/Moderator');
let Administrator = require('../models/Administrator');
var username;
router.get('/',function(req,res){
    res.render('test');
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   Administrator.getAdministratorByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}
   });
  }));

passport.serializeUser(function(administrator, done) {
  done(null, administrator.id);
});

passport.deserializeUser(function(id, done) {
 Administrator.getAdministratorById(id, function(err, administrator) {
    done(err, administrator);
  });
});
router.post('/login',function(req,res){
 username=req.body.username
    passport.authenticate('local', {successRedirect:'/administrator/success', failureRedirect:'/administrator/fail'}),
  function(req, res) {
        console.log('ok');
    res.redirect('/administrator/success');
     req.login();
    
    req.isAuthenticated()=true;}
   
});
    router.get('/success',function(req,res){
    res.render('success');
});
    router.get('/fail',function(req,res){
    res.render('fail');
});


router.get('/',function(req,res){
  res.render('test');
});

module.exports = router;