const { User } = require('../models/user')
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Please Login!!")
        }
        const decodedData = await jwt.verify(token, "jwtKey@devTinder123");
        const { _id } = decodedData;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("user not found")
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(400).send("user Auth FAILED:" + err.message);
    }
}

module.exports = {
    userAuth
};