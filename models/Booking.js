var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt= require ('bcrypt-nodejs');
var autoIncrement = require('mongoose-auto-increment');
var server = require('../../server');
var connection = server.connection;
autoIncrement.initialize(server.connection);



var BookingSchema= new Schema({
  email: {type:String, required: true, unique: true},
  mod_username: {type:String, required: true},
  activity : {type:String, required: true},
  payment : {type: Boolean, required: true},
  booking_number: {type: Number},
});

BookingSchema.plugin(autoIncrement.plugin, {model: 'Booking', field: 'booking_number'})

 

module.exports= mongoose.model('Booking',BookingSchema);