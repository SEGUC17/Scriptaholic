var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('../config/database');
var Schema = mongoose.Schema;

var AdministratorSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isSuper: {
        type: Boolean,
        required: true
    },

})

var Administrator = module.exports = mongoose.model('Administrator', AdministratorSchema);

module.exports.getAdministratorByUsername = function(username, callback) {
    var query = {
        username: username
    };
    Administrator.findOne(query, callback);
}

module.exports.getAdministratorById = function(id, callback) {
    Administrator.findById(id, callback);
}

module.exports.addAdmin = function(newAdmin, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmin.password = hash;
            newAdmin.save(callback);
        })
    })
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch)
    })
}
