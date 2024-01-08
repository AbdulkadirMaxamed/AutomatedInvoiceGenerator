// imports
const express = require('express')
const router = express.Router()
const Cars = require('../models/cars')
const Order = require('../models/order')
const mongoose = require('mongoose')
// const checkAuth = require('../middleware/checkAuth')


//history --- of all cars sold
//history --- of 1 car so if im searching i can do by their reg
/*
router.get('/history/', (req, res, next) => {
    Order.find({status: "sold"}).exec() // only want to find all cars with status set to sold
    .then(doc => {
        if (doc.length > 0) {
            res.status(200).json(doc)
        } else {
            res.status(404).json({
                message: "No sold cars"
            })
        }
            })
        }
)
*/

router.get('/history/:CarReg', (req,res,next) =>{
    const CarReg = req.params.CarReg
    Order.find({reg: CarReg, status: "sold"}).exec()
    .then(doc =>{
        if(doc){
            Cars.find({reg: CarReg}).exec()
            .then(doc =>{
            if(doc.length>0){
                res.status(200).json(doc)
                console.log(doc)
            }else{
                res.status(404).json({
                    message: "There is no car that matches this reg"
                })
            }
        }
    )}
    })
})

// Handle incoming GET requests to /history
router.get('/history/', (req, res, next) => {
    Order
    .find({status: "sold"})
    // .select(' car carReg _id') // select these three objects to be returned
    // .populate('car', 'make', 'model') // shows only make and model properties of car object
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length, // provides a count of the number of sold cars in the database
            orders: docs.map(doc => { // map method used to return specified properties of order below
                return {
                    // _id: doc._id,
                    // make: doc.make,
                    // model: doc.model,
                    // reg: doc.reg,
                    request: {
                        type: 'GET',
                       // url: 'http://localhost:3000/orders/history/' + carReg
                       url: `http://localhost:3000/orders/history/${encodeURIComponent(doc.reg)}`
                    }
                }
            }),
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

// Handle incoming GET requests to /orders
router.get('/', (req, res, next) => {
    Order
    .find()
    // .select(' car carReg _id') // select these three objects to be returned
    // .populate('car', 'make', 'model') // shows only make and model properties of car object
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length, // provides a count of the number of items in orders database
            orders: docs.map(doc => { // map method used to return specified properties of order below
                return {
                    _id: doc._id,
                    car: doc.car,
                    carReg: doc.carReg,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            }),
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

// Handle incoming POST requests to /orders
router.post('/', (req, res, next) => {
    Cars.findById(req.body.id)
    .then(doc => {
        if (!doc) { // !car means if car is not found
            res.status(404).json({
                message: 'Car not found',
                status: 404 // if car not found error 404 and this message will be returned
            });
        }else{
            const order = new Order({ // initialising the order object and its properties
                _id: new mongoose.Types.ObjectId(),
                reg: req.body.reg,
                status: "sold"
            });
            return order.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Order stored',
                    createdOrder: {
                        _id: result._id,
                        carReg: result.reg,
                        status: result.status
                    },
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err. message || 'Internal Server Error' // err.message used to display exact error message for easier debugging
                })
            })
        }
        // .save() gives you a real promise by default, no need to use .exec()
    })
    
})

// Handle incoming GET requests to /orders with specified order ID
router.get('/:orderID', (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('car') // method used to select specific object and its properties to display
    .exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

// Handle incoming DELETE requests to /orders with specified order ID
router.delete('/:orderId', (req, res, next) => {
    Order.deleteOne({_id: req.params.orderId})
    .exec()
    .then(order => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: { carId: 'Id', carReg: 'String'}
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

// exporting orders function
module.exports = router


//for orders we will divide it to be cars currently processing order
//vs 
//cars sold