const express = require('express')
const router = express.Router()


router.get('/', (req,res,next) =>{
    res.status(200).json({
        message: 'Handling info for cars page'
    })
})

//retrieve all cars based off car id
router.get('/:CarId', (req,res,next) =>{
    const id = req.params.CarId
    if (id === "astra"){
        res.status(200).json({
            message: 'Handling info for cars page. This is by car id',
            id: id
        })
    }else{
        res.status(400).json({
            message: 'do not recognise that car'
        })
    }
    
})

//retrieve all cars based off car name
router.get('/:CarName', (req,res,next) =>{
    res.status(200).json({
        message: 'Handling info for cars page. This is by car name'
    })
})


//handling adding new car to database
router.post('/addNewCar', (req,res,next) =>{
    const newCar = {
        make: req.body.make,
        model: req.body.model,
        type: req.body.type,
        reg: req.body.reg,
        mileage: req.body.mileage,
        price: req.body.price
    }

    res.status(201).json({
        message: "Uploading new Car",
        createdCar: newCar
    })
})

module.exports = router