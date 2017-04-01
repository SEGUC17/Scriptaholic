var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var businessSchema = mongoose.Schema({
    username:{
    	type:String,
        required: true,
        unique:true
    },
    location:[{type:String,required: true}],
    business_number:{
        type:Number,
        required: true
    }, 
    business_name:{
        type:String,
        required: true
    },
    pictures:[{type:String}],
     rating:{
        type:Number
    },
    reviews:[{type:String}],
    website:{
        type:String
    },
    
    description:{
        type:String
    },
        rates:{
        type: Number
    },      
    news:[{
        type:String
    }],
    payment_methods:[{type:String}],
})

var Business = mongoose.model("business", businessSchema);
module.exports = Business;

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