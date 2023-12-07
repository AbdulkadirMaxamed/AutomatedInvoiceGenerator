const express = require('express')
const router = express.Router()
const Cars = require('../models/cars')
const mongoose = require('mongoose')



router.get('/', (req,res,next) =>{
    Cars.find().exec()
    .then(doc => {
        console.log(doc)
        //send reponse if the id not in the db
        if(doc){
            res.status(200).json(doc)
        }else{
            res.status(404).json({
                message: "No Cars stored in the DB"
            })
        }

    })
    //send the res error status in the catch block to avoid async issue
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

//retrieve all cars based off car id
router.get('/:CarId', (req,res,next) =>{
    //id passed in through the url equal to :CarId
    const id = req.params.CarId
    Cars.findById(id).exec()
    //send the res status in the then block to avoid async issue
    .then(doc => {
        console.log(doc)
        //send reponse if the id not in the db
        if(doc){
            res.status(200).json(doc)
        }else{
            res.status(404).json({
                message: "Car does not exist with that id"
            })
        }

    })
    //send the res error status in the catch block to avoid async issue
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })

})

//retrieve all cars based off car name
router.get('/model/:CarModel', (req,res,next) =>{
    const carModel = req.params.CarModel
    Cars.find({make: carModel}).exec()
    .then(doc =>{
        if(doc.length>0){
            res.status(200).json(doc)
        }else{
            res.status(404).json({
                message: "Seems like car is not in the DB"
            })
        }
    })
    .catch(err => {
        console.log("you have reached here" + err)
        res.status(500).json({
            message: "im here",
            error: err
        })
    })
})


//handling adding new car to database
router.post('/addNewCar', (req,res,next) =>{
    //this will add the new structured cars object into the cars schema on mongoose
    //using the structure setup in the models/cars.js file
    const newCar = new Cars({
        _id: new mongoose.Types.ObjectId(),
        make: req.body.make,
        model: req.body.model,
        type: req.body.type,
        reg: req.body.reg,
        mileage: req.body.mileage,
        price: req.body.price

    })
    newCar.save().then(result =>{
        console.log(`new car uploaded successfully ${result}`)
        res.status(201).json({
            message: "Uploading new Car",
            successMessage: "new car uploaded successfully",
            createdCar: newCar
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })

    
})

module.exports = router


//search cars by reg
//will need to make a new category called reg and search by reg through params.