// importing mongoose
const mongoose = require('mongoose')
// created userSchema using .Schema function in Mongoose. User consists of id, email and password object
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, 
        required: true, 
        unique: true, // doesn't add validation, just optimises from performance perspective as specifies that only one entry for each email
        match: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}, // uses email regex for valid email entry
    password: {type: String, required: true}
}
)
// exporting schema
module.exports = mongoose.model('User', userSchema)