var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var autoIncrement = require('mongoose-auto-increment');
var server = require('../../server');
var connection = server.connection;
var Schema = mongoose.Schema;
autoIncrement.initialize(server.connection);



var BookingSchema = new Schema({
    client_id: { //            change to client id
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
        
    },
    business_id: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    booking_number: {
        type: Number
    },
    activity_id: {                  // references activity
        type: Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    },
    payment: {
        type: String,
        required: true
    },

    venue: {
        city: String,
        area: String,
        address: String
    },
    time: {
        type: Date,
        required: true
    },
    isEvent: {
        type: Boolean
    },

});

BookingSchema.plugin(autoIncrement.plugin, {
    model: 'Booking',
    field: 'booking_number'
})



module.exports = mongoose.model('Booking', BookingSchema);