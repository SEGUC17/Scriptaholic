var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var activitySchema = mongoose.Schema({
    moderator_username:{
    	type:String,
        required: true,
        unique:true
    },
    name:{
        type:String,
        required: true
    },
    availablity:{
        type:Number,
        required: true
    },
    discount:{
        type:String,
        required: true
    },
    images:[String],
    rating:{
        type:Number
    },
    payment:{
        type:String
    },
    website:{
        type:String
    },       
})

var Activity = mongoose.model("activity", activitySchema);
module.exports = Activity;