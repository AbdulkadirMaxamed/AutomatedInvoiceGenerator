const mongoose = require('mongoose')

const carDB = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    make: String,
    model: String,
    type: String,
    reg: String,
    mileage: Number,
    price: Number
});

module.exports = mongoose.model('Cars', carDB)
