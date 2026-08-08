const express = require("express");
const bcrypt = require('bcrypt');
const app = express();
const { userAuth } = require("./middleware/auth");
const { connectDB, PORT } = require("./config/database");
const { validateSignUpData } = require('./utils/validation');
const { User } = require("./models/user");
const cookieParser = require("cookie-parser");
const port = 3000;

app.use(express.json());
app.use(cookieParser());

//get profile API

app.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user);

    } catch (err) {
        res.status(400).send("PROFILE FAILED:" + err.message);
    }
});

app.post("/sendConnectRequest", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user.firstName + ": send connection request successfully");
    } catch (err) {
        res.status(400).send("SEND CONNECTION REQUEST FAILED:" + err.message);
    }
});

// login API
app.post("/login", async (req, res) => {
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

app.post("/signup", async (req, res) => {
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

connectDB()
    .then(() => {
        console.log("Database connection established");
        app.listen(port, () => {
            console.log("Server started running on port " + port)
        })
    })
    .catch((err) => {
        console.error("Database can not be connected");
    })


