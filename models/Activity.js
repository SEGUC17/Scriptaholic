var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activitySchema = mongoose.Schema({
    business_id: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    capacity: Number,
    dates: [{
        date: Date,
        capacity: {
            type: Number,
            default: 0
        },
    }],
    startDate: Date,
    endDate: Date,

    discount: {
        actualDiscount: Number,
        originalPrice: Number
    },
    images: [{
        type: String
    }],

    price: { //was payment
        type: Number,
        required: true,

    },

})

var Activity = mongoose.model("activity", activitySchema);
module.exports = Activity;

module.exports.getActivityById = function(id, callback) {
    Activity.findById(id, callback);
}
