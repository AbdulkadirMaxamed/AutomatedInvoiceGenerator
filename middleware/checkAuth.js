// importing json web token 
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1] // using .split and index[1] to remove Bearer and white space from header
        const decoded = jwt.verify(token, process.env.JWT_KEY) // returns verified and decoded value
        req.userData = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
};