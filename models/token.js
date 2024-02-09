//this token will be used to measure the expiry link on password reset
const mongoose = require('mongoose')
// created userSchema using .Schema function in Mongoose. User consists of id, email and password object
const tokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
        // ref: "User",
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900// this is the expiry time in seconds
    }
})
// exporting schema
module.exports = mongoose.model('Token', tokenSchema)