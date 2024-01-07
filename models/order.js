// importing mongoose
const mongoose = require('mongoose')
// created orderSchema using .Schema function in Mongoose. Order consists of id, car object and car registration to ensure product can be matched to the order
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reg: { type: String, required: true },
    status: String
});
// exporting schema
module.exports = mongoose.model('Order', orderSchema)