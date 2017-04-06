var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
    business_id: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
    },
    new_bank_account: {
        type: Number,
        required: true
    },
    status: String

})

var Request = module.exports = mongoose.model("Request", RequestSchema);

module.exports.getRequestById = function(id, callback) {
    Request.findById(id, callback);
}
