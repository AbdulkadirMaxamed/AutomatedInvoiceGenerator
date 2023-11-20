const express = require("express");
const app = express();
const mongoose = require('mongoose');

// //setting up user route for admin authentication
const userRoute = require('./routes/users');

mongoose.connect(`mongodb+srv://abdulkadirq12:InvoiceGenerator@cluster0.kynpuci.mongodb.net/`,{
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;

app.use(express.json());

// app.use('/users', userRoute);
app.use((req,res,next) =>{
    res.status(200).json({
        message: 'server is currently running'
    })
})

module.exports = app;