var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var administratorSchema = mongoose.Schema({
    username:{
    	type:String,
        required: true,
        unique:true
    },
    name:{
        type:String,
        required: true
    },
     password:{
        type:String,
        required: true
    },
    isSuper:{
        type:Boolean,
        required: true
    },

})
module.exports.getAdministratorByUsername = function(username, callback){
	var query = {username: username};
	Administrator.findOne(query, callback);
}

module.exports.getAdministratorById = function(id, callback){
	Administrator.findById(id, callback);
}


var Administrator = mongoose.model("administrator", administratorSchema);
module.exports = Administrator;