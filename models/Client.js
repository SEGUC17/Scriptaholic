var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Booking = require('../models/Booking');
var Schema = mongoose.Schema;




var ClientSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: String,
    email: String,
    password: String,
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    subscriptions: [{
        type: Schema.Types.ObjectId,
        ref: 'Business'
    }],

});


var Client = module.exports = mongoose.model('Client', ClientSchema);




module.exports.getClientByUsername = function(username, callback) {
    var query = {
        username: username
    };
    Client.findOne(query, callback);
}

module.exports.getClientById = function(id, callback) {
    Client.findById(id, callback);
};

module.exports.addClient = function(newClient, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newClient.password, salt, (err, hash) => {
            if (err) throw err;
            newClient.password = hash;
            newClient.save(callback);
        })
    })
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch)
    })
}

