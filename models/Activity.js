var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
	
	business_id:{
	    	type:String,
		required: true,
		unique:true
	},
	
	name:{
		type:String,
		required: true
	},
	
	dates:[{
		hour: Number, 
		day: Number,
		month: Number,
		year: Number
	}], 

	capacity:{
		type:Number,
		required: true
	},

	discount:{
		type:String,
	},

	images:[
		String
	],
	
	rating:[
		Number
	],

	reviews:[{
		userN:String,
		review: String,	
	}],

	payment:{
		type:Number,
		required: true
	},
      
})

var Activity = mongoose.model("activity", activitySchema);
module.exports = Activity;
