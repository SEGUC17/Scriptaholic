var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./config/database');
var router = require('./routes/router');

//Connect to database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database)
})

// On Error
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err)
})

var app = express();

// Port number
var port = 3000;
//var port = process.env.port real deployement

//CORS Middleware
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.urlencoded({
    limit: '50mb'
}));
app.use(bodyParser.json({
    limit: '50mb'
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs')

app.use('/', router);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

require('./config/passport')(passport);

//Starting the server
app.listen(port, () => {
    console.log('Server started on port ' + port);
})
