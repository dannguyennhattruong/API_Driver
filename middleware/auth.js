const jwt = require('jsonwebtoken')
const Driver = require('../models/Driver.model')
const JWT_KEY ='WinterIsComingGOT2019';

const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    // console.log(token)
    const data = jwt.verify(token,JWT_KEY)
    console.log(data)
    try {
        const driver = await Driver.findOne({ _id: data._id, 'tokens.token': token })
        // console.log(driver)
        if (!driver) {
            throw new Error('')
        }
        req.driver = driver
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource',errror:error })
    }

    return req.driver;

}
module.exports = auth