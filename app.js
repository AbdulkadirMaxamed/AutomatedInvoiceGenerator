const express = require("express");
const app = express();
const mongoose = require('mongoose');

// //setting up user route for admin authentication
const userRoute = require('./routes/users');
const orderRoute = require('./routes/orders');
const carsRoute = require('./routes/cars');

mongoose.connect(`mongodb+srv://abdulkadirq12:InvoiceGenerator@cluster0.kynpuci.mongodb.net/`,{
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;

app.use(express.json());

// .use function to set headers and permitted methods to server
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
    };
    next(); // passes control to next matching route
});

// routes which should handle requests
app.use('/orders', orderRoute);
app.use('/users', userRoute);

app.use('/cars', carsRoute);
app.use((req,res,next) =>{
    res.status(200).json({
        message: 'server is currently running'
    })
})

// takes error variable from above and outputs error message as JSON
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;