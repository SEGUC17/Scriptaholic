var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var autoIncrement = require('mongoose-auto-increment');

var moderatorSchema = mongoose.Schema({
    email:{
        type:String,
        required: true
    },
    username:{
    	type:String,
        unique: true,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    bank_account:{
        type: Number
    },
    business_name:{
        type:String
    },
    pictures: [{ data: Buffer, contentType: String, imgPath: String }],
    
})


//moderatorSchema.plugin(autoIncrement.plugin, { model: 'Moderator', field: 'number' });

var Moderator = mongoose.model("moderator", moderatorSchema);
module.exports = Moderator;
module.exports.createModerator = function(newModerator, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newModerator.password, salt, function(err, hash) {
            newModerator.password = hash;
            newModerator.save(callback);
        });
    });
}
module.exports.getModeratorByUsername = function(username, callback){
    var query = {username: username};
    Moderator.findOne(query, callback);
}
module.exports.getModeratorById = function(id, callback){
    Moderator.findById(id, callback);
}
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

/*module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}*/