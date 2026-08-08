const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validation');

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("Invalid credential");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error("Invalid credential");
        }
        else {
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 9 * 60 * 1000), // 9 minutes from now
                httpOnly: true
            });
            res.send("login successful");
        }

    } catch (err) {
        res.status(400).send("LOGIN FAILED:" + err.message);
    }
});

authRouter.post("/signup", async (req, res) => {
    try {
        // validate the req.body
        validateSignUpData(req);
        // creating a user instances of the user model
        const { firstName, lastName, password, emailId } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            password: hashPassword,
            emailId
        });
        await user.save();
        res.send("user added successfully");

    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
});
module.exports = {
    authRouter
}