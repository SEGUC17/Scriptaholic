var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Moderator = require('../models/Moderator');
var Business = require('../models/Business');
var UnregisteredModerator = require('../models/UnregisteredModerator');
var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });
var path = require('path');
var multiparty = require('multiparty');
var bcrypt = require('bcryptjs');
var username='tarekk';
var business_name='air zone';
var async=require('async');
var currentbusiness;
var locations;

router.get('/moderatorsignup', function(req, res){
      var newModerator=new Moderator({
      	email: 'ssjssj',
      	username: 'tarekk',
      	password: '0000',
      	bank_account: 12345,
        business_name:'air zone',  
      });
    var newBusiness = new Business({
         business_name:business_name,
        username:username,
        location:['cairo','giza'],
        business_number:1234,
        pictures:[],
        ratings:[],
        reviews:[],
        website:'www.airzone.com',
        description:'air zone description',
        payment_methods:[],
    });
  newBusiness.save(function(err, business){
            if(err){
                return res.send(err.message)
                console.log(err);
            }
            else{
   console.log(newBusiness);
                  res.render('moderatorsignup');
            }
     
  });
      //console.log(newModerator);
      	Moderator.createModerator(newModerator, function(err, user){
			if(err) throw err;
			console.log(user);
		});
    });

router.get('/locations',function(req,res){
    
   async.series([
       function(callback){
              currentbusiness=Business.findOne({business_name:business_name},function(err,result){
       if(err){
            callback(err);
       } 
         currentbusiness=result;     
                  locations=result.location;      
                  callback();
                 });

       },
       function(callback){
          //console.log(locations);
           res.render('locations',{locations});
           callback();
       },

   ], function(err){
      if (err)res.send(err.message);
     // res.render('index',{projects,img,currentuser});
  }); 

    
});
router.post('/addlocation',function(req,res){
   if (req.body.location.length==0){
       res.redirect('/moderator/locations');
   } 
    else {
        console.log(req.body.location);
        Business.update({business_name:currentbusiness.business_name},{$addToSet:{location:req.body.location}},function(err,result){
                   });
        console.log(currentbusiness.location);
        res.redirect('/moderator/locations');
    }
});
router.get('/chooseEdit',function(req,res){
    res.render('chooselocationedit',{locations});
});
router.get('/chooseDelete',function(req,res){
    res.render('chooselocationdelete',{locations});
});
router.post('/delete',function(req,res){
    console.log(req.body.location);
    if (locations.length>1)
    Business.update({business_name:currentbusiness.business_name},{$pull:{location:req.body.location}},function(err,result){
                   });
           
        console.log(currentbusiness.location);
        res.redirect('/moderator/locations');
});
router.post('/edit',function(req,res){
    console.log(req.body.location);
    Business.update({business_name:currentbusiness.business_name,location:req.body.location},{$set:{"location.$":req.body.newlocation}},function(err,result){
        console.log(result);
                   });
           
        console.log(currentbusiness.location);
        res.redirect('/moderator/locations');
});
router.get('/choosepayment',function(req,res){
    res.render('choosepayment');
});
router.post('/payment',function(req,res){
     
   async.series([
       function(callback){
              currentbusiness=Business.findOne({business_name:business_name},function(err,result){
       if(err){
            callback(err);
       } 
         currentbusiness=result;    
                  callback();
                 });

       },
       function(callback){
           console.log(currentbusiness.payment_methods);
           console.log(req.body.payment);
           
        Business.update({business_name:currentbusiness.business_name},{$addToSet:{payment_methods:{$each:req.body.payment}}},function(err,result){
            console.log(result);
                   });
           callback();
       },
       function(callback){
           console.log(currentbusiness.payment_methods);
            res.redirect('/moderator/choosepayment');
           callback();
       },

   ], function(err){
      if (err)res.send(err.message);
     // res.render('index',{projects,img,currentuser});
  });
         


});
router.post('/register', upload.any(), function(req, res){

      var email = req.body.email;
      var business_location = req.body.business_location;
      var business_number = req.body.business_number;
      var bank_account = req.body.bank_account;
      var business_name = req.body.business_name;
     var newUnregisteredModerator = new UnregisteredModerator ;
        newUnregisteredModerator.email=email;
        newUnregisteredModerator.business_location=business_location;
        newUnregisteredModerator.business_number=business_number;
        newUnregisteredModerator.bank_account=bank_account;
        newUnregisteredModerator.business_name=business_name;
         for(var i=0; i<req.files.length; i++){
      var str = req.files[i].path;
	  var y= str.replace('public', '');

      var x = {contentType: 'image/jpeg', imgPath: y};
      //var x = {data: 3, contentType: 'ssgsg'};
      newUnregisteredModerator.pictures.push(x);
      console.log(x);
      }

       console.log(newUnregisteredModerator);


            newUnregisteredModerator.save(function (err, mod) {
if (err) throw err;
})
      res.render('test');
      console.log(email);

    });

router.get('/login', function(req, res){
        res.render('test');
    });
passport.use(new LocalStrategy(
  function(username, password, done) {
   Moderator.getModeratorByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}
   	Moderator.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			//req.flash('success_msg', 'You are now logged in');
   			return done(null, user);
   			//res.send(500, {error: 'You are now logged in'});
   			//req.flash('success_msg', 'You are now logged in');
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Moderator.getModeratorById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/logintry',function(req,res){
  passport.authenticate('local', {successRedirect:'/moderator/success', failureRedirect:'/moderator/fail', successFlash: 'You are now logged in!', failureFlash: true}),
  function(req, res) {
    res.redirect('/moderator/success');
  }
  });

router.get('/', function(req, res){
     res.render('moderatorsignup');
});

  router.get('/success',function(req,res){
    res.render('success');
});
    router.get('/fail',function(req,res){
    res.render('fail');
});
module.exports = router;