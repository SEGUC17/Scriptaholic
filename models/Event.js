var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var eventSchema = mongoose.Schema({
    business_id: {        //references business
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    /*date: {
        type: String,
        required: true
    },*/
    venue: {
        city: String,
        area: String,
        address: String
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    images: [{
        type: String
    }]

})

var Event = mongoose.model("Event", eventSchema);
module.exports = Event;