//require depenciess
var express = require('express');

var router = require('./app/routes/routes');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var validator = require('express-validator');
var db = "mongodb://localhost:27017/project";
mongoose.connect(db);
var app = express();
app.use(validator());
mongoose.Promise = global.Promise;

app.set('view engine', 'ejs');

// configure app
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));
app.use(flash());
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(router);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


//Ahmed
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



// start the server
app.listen(8080, function(){
    console.log("server is listening on port 8080");
})