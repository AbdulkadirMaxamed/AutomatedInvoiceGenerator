// imports
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') // bcyrpt used to encrypt user passwords
const jwt = require('jsonwebtoken') // jsonwebtoken for generating web toker
const checkAuth = require('../middleware/checkAuth')
const token = require('../models/token')
const crypto = require("crypto");
const sendEmail = require("../utils/emails/sendEmail");

// POST method - create new users
// Method updated to only allow creation of 1 user
router.post('/signup', async (req, res, next) => { // async function used with await to enable asynchronous, promise-based behavior to be written in a cleaner style and avoiding the need to explicitly configure promise chains.
    try {
        // Check if there is already a user


        /*temp fix so we can test password reset link*/

                        // const existingUser = await User.findOne({});

                        // if (existingUser) {
                        //     return res.status(409).json({
                        //         message: 'Admin user already exists'
                        //     });
                        // }

        // Check if the password is valid
        if (req.body.password.length < 5 || req.body.password.length > 10) {
            return res.status(401).json({
                message: 'Password invalid'
            });
        }

        // Will encrypt password with bcrypt
        const hash = await bcrypt.hash(req.body.password, 10); // 10 salting rounds, considered safe

        // Create a new user
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
        });

        // Save the user to the database
        await user.save();

        res.status(201).json({
            message: 'User created'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

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
        //authentication should be for admin only!!
        if (req.body.email.toLowerCase() === "resolveathletics@gmail.com"){
            console.log("successful admin login")
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
                        expiresIn: "5m"
                    });
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
            });
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.post('/resetPassword',  (req, res, next) => {
    User.find({ email: req.body.email }) // can also use findOne() to specify checking only 1 user
    .exec()
    .then(async (user) => {
        if (user.length < 1) { // checks if user exists, if < 1 then user doesn't exist
            return res.status(401).json({ // 401 means unauthorised
               message: 'Auth failed'
            });
        }
        
        //authentication should be for admin only!!
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, 10);

        await new token({
            userId: user[0]._id,
            token: hash,
            createdAt: Date.now(),
        }).save();

        const link = `http://localhost:3000/passwordReset?token=${resetToken}&id=${user[0]._id}`;
        sendEmail(user[0].email,"Password Reset Request",{name: "Abdulkadir",link: link,},"./template/requestResetPassword.handlebars");
        return link;
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
