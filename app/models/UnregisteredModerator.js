var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var unregisteredModeratorSchema = mongoose.Schema({
    email:{
        type:String
    },
    business_location:{
        type:String
    },
    business_number:{
        type:Number
    },
    bank_account:{
        type:Number
    },
    business_name:{
        type:String
    },

})

var unregisteredModerator = mongoose.model("unregisteredModerator", unregisteredModeratorSchema);
module.exports = unregisteredModerator;
