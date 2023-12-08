const express = require("express");
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan')
const bodyParser = require('body-parser')

// //setting up user route for admin authentication
const userRoute = require('./routes/users');
const carsRoute = require('./routes/cars');
const orderRoute = require('./routes/orders');

mongoose.connect(`mongodb+srv://abdulkadirq12:InvoiceGenerator@cluster0.kynpuci.mongodb.net/`,{
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({
    extended: false,
}))
app.use(bodyParser.json())

//setting ACAO
app.use((req,res,next) =>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, GET, PATCH, DELETE")
        return res.status(200).json({})
    }
    next()
})

app.use(express.json());

// routes which should handle requests
app.use('/orders', orderRoute);
app.use('/users', userRoute);
app.use('/cars', carsRoute);

app.use((req,res,next) =>{
    res.status(200).json({
        message: 'server is currently running'
    })
})

//throws an error if database connection fails
app.use((req,res,next) =>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req,res,next) =>{
    res.status(err.status || 500)
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports = app;