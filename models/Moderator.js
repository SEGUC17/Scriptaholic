var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');



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
        
    }
    
    
})

//moderatorSchema.plugin(autoIncrement.plugin, 'Moderator');

var Moderator = mongoose.model("moderator", moderatorSchema);
module.exports = Moderator;

