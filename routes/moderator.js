var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var Booking = require('../models/Booking.js');
//var Activity = require('../models/Activity.js');
var Business = require('../models/Business.js');

var Moderator = require('../models/Moderator');
/*router.get('/', function(req, res) {
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
*/
router.post('/viewReservations', function(req, res){
     Booking.find({'mod_username':req.body.username}, function (err, users) {
        console.log(req.body)
        res.send(users);
});
  });

router.post('/ViewRating', function(req,res){

    Business.findOne({'username':req.body.username},  function(err, business){

        console.log(business.rating);
    });

});
router.post('/ViewReviews', function(req,res){
    /*var newModerator=new Moderator({
        email: 'hady1@gmail.com',
        username: 'hady1',
        password: '0000',
        bank_account: 13,
      });

      console.log(newModerator);
        Moderator.createModerator(newModerator, function(err, user){
      if(err) throw err;
      console.log(user);
    });
        newModerator.save(function(err, moderator){
            if(err){
                return res.send(err.message);
                console.log(err);
            }
  });*/


  
  
  /*var newBusiness = new Business({
        username:'hady1',
        location:['cairo','giza'],
        business_number:12329,
        business_name:'escape1',
        rating:9,
        reviews:['Very good','Excellent','Poor'],
        website:'www.escape1.com',
        description:'escape description',
        rates:2,
        news:'Open',
        });*/



  //console.log(newBusiness);
  
  /*newBusiness.save(function(err, business){
            if(err){
                return res.send(err.message);
                console.log(err);
            }
            console.log(business);
  });*/


    Business.findOne({'username':req.body.username},  function(err, business){

        res.send(business.reviews);
    });
});






module.exports = router;
