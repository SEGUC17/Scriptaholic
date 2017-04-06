var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('../config/database');
var Schema = mongoose.Schema;


var BusinessSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    location: [{
        city: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    }],
    business_number: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    bank_account: {
        type: Number,
        unique: true,
        required: true
    },
    pictures: [{
        type: String
    }],
    average_rating: Number,
    feedback: [{
        clientUsername: String,
        rating: Number, //mmken rating mn gher review bas msh mmken review men gher rate
        review: String
    }],
    website: {
        type: String,
        default: "N/A"
    },
    description: {  
        type: String,
        default: "N/A"
    },
    news: [{
        type: String
    }],
    notifications: [{
        type: String
    }],
    payment_methods: [{
        type: String
    }],
    subscribers: [{
        type: String
    }],
})

var Business = module.exports = mongoose.model("Business", BusinessSchema);


module.exports.getBusinessByUsername = function(username, callback) {
    var query = {
        username: username
    }

    Business.findOne(query, callback);
}

module.exports.getBusinessById = function(id, callback) {
    Business.findById(id, callback);
}

module.exports.addBusiness = function(business, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(business.password, salt, (err, hash) => {
            if (err) throw err;
            business.password = hash;
            business.save(callback);
        })
    })
}

module.exports.updateBusiness = function(username, business, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(business.password, salt, (err, hash) => {
            if (err) throw err;
            console.log(business)
            console.log(username)
            Business.update({
                'username': username
            }, {
                $set: {
                    'username': business.username,
                    'password': hash,
                    'email': business.email,
                    'business_name': business.business_name,
                    'location': business.location,
                    'type': business.type                    
                }
            }, callback)
        })
    })
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch)
    })
}
