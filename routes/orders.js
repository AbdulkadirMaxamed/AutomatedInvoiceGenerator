// imports
const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')

// Handle incoming GET requests to /orders
router.get('/', checkAuth, (req, res, next) => {
    Order
    .find()
    .select(' car carReg _id') // select these three objects to be returned
    .populate('car', 'make', 'model') // shows only make and model properties of car object
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
router.post('/', checkAuth, (req, res, next) => {
    Car.findById(req.body.carId)
    .then(car => {
        if (!car) { // !car means if car is not found
            return res.status(404).json({
                message: 'Car not found' // if car not found error 404 and this message will be returned
            });
        }
        const order = new Order({ // initialising the order object and its properties
            _id: new mongoose.Types.ObjectId(),
            carReg: req.body.carReg,
            car: req.body.carId
        });
        // .save() gives you a real promise by default, no need to use .exec()
    return order.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order stored',
            createdOrder: {
                _id: result._id,
                car: result.car,
                carReg: result.carReg
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
})

// Handle incoming GET requests to /orders with specified order ID
router.get('/:orderID', checkAuth, (req, res, next) => {
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
router.delete('/:orderId', checkAuth, (req, res, next) => {
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