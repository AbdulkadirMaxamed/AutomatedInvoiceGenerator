//Abeer this is where your user route connection should.
//according to the scope we only require 1 user "admin"
//a basic connection to authenticate if the admin user is logged in
//will need to consider validation and password encryption

// imports
const express = require('express')
const router = express.Router
const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt') // bcyrpt used to encrypt user passwords
const jwt = require('jsonwebtoken') // jsonwebtoken for generating web toker
const checkAuth = require('../middleware/checkAuth')

// POST method - create new users
router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email}) // .find used to check if user with same email already exists
    .exec()
    .then(user => {
        if (user.length >= 1) { // user.length used because user is not Null, will be empty array, .length >= 1 means email already exists. For length 0 we want to create a new user
            return res.status(409).json({
                message: 'Account with this email already exists'
            })
        } else {
            // Will encrypt password with node.bcrypt.js
            bcrypt.hash(req.body.password, 10 /* (no. of salting rounds, 10 considered safe)*/, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err // returning err if hashed password not generated
                        })
                    } else { // else block layout ensures user is only created if a hashed password is generated
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash
                        });
                        user.save()
                        .then(result => {
                            console.log(result)
                            res.status(201).json({
                                message: 'User created'
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                error: err
                            })
                        })
                    }})
                }
            })
        })

// POST method - login requests
router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email }) // can also use findOne() to specify checking only 1 user
    .exec()
    .then(user => {
        if (user.length < 1) { // checks if user exists, if < 1 then user doesn't exist
            return res.status(401).json({ // 401 means unauthorised
               message: 'Auth failed'
            });
        }
       bcrypt.compare(req.body.password, user[0].password, (err, result) => { // user[0] specifies first user in array
        if (err) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        if (result) {
            const token = jwt.sign({
                email: user[0].email,
                userID: user[0]._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            });
            return res.status(200).json({
                message: 'Auth successful',
                token: token
            });
        }
       });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

// DELETE method - delete users with specified user ID
router.delete('/:userId', checkAuth, (req, res, next) => {
    User.deleteOne({_id: req.params.id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

// export
module.exports = router