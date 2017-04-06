var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;


var ModeratorSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    bank_account: {
        type: Number,
        unique: true,
        required: true
    },
    business_name: {
        type: String,
        required: true
    },
    business_location: [{
        city: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    }],
    business_number: {
        type: Number,
        unique: true,
        required: true
    },
    business_type: {
        type: String
    },
    status: String
})

var Moderator = module.exports = mongoose.model("Moderator", ModeratorSchema);

module.exports.getModeratorByBusinessNumber = function(business_number, callback) {
    var query = {
        business_number: business_number
    };
    Moderator.findOne(query, callback);
}

module.exports.getModeratorById = function(id, callback) {
    Moderator.findById(id, callback);
}

module.exports.confirmModerator = function(newModerator, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newModerator.business_number.toString(), salt, (err, hash) => {
            if (err) throw err;
            Moderator.update({
                'business_number': newModerator.business_number
            }, {
                $set: {
                    'status': 'accepted',
                    'username': newModerator.business_name,
                    'password': hash
                }
            }, callback)
        })
    })
}
