const express = require("express");
const bcrypt = require('bcrypt');
const app = express();
const { adminAuth, userAuth } = require("./middleware/auth");
const { connectDB, PORT } = require("./config/database");
const { validateSignUpData } = require('./utils/validation');
const { User } = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const port = 3000;

app.use(express.json());
app.use(cookieParser());

//get profile API

app.get("/profile", async (req, res) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            throw new Error("Invalid token")
        }
        const decodeMessage = await jwt.verify(token, "jwtKey@devTinder123");
        const {_id} = decodeMessage;
        const user = await User.findById(_id);
         if (!user) {
            throw new Error("Invalid user or token")
        }
        res.send(user);

    } catch (err) {
        res.status(400).send("PROFILE FAILED:" + err.message);
    }
})

// login API

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("Invalid credential");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credential");
        }
        else {
            const token = await jwt.sign({ _id: user._id }, "jwtKey@devTinder123")
            res.cookie("token", token);
            res.send("login successful");
        }

    } catch (err) {
        res.status(400).send("LOGIN FAILED:" + err.message);
    }
})

// Update data of the user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        if (data?.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }

        const userPatch = await User.findByIdAndUpdate({ _id: userId }, { $set: data }, {
            returnDocument: "after",
            runValidators: true,
        });
        res.send("user updated successfully");
    } catch (err) {
        res.status(400).send("UPDATE FAILED:" + err.message);
    }
})

app.delete('/user', async (req, res) => {
    console.log(req.body.userId);
    try {
        // const userPatch = await User.findByIdAndDelete({ _id: req.body.userId });
        const userDelete = await User.deleteOne({ _id: req.body.userId });
        res.send("user deleted successfully");
    } catch (err) {
        res.status(400).send("something went wrong in delete user");
    }
});

app.get('/user', async (req, res) => {
    try {
        const userById = await User.findById(req.body.userId);
        if (!userById) {
            res.status(401).send("id not find");
        } else {
            res.send(userById);
        }
    } catch (err) {
        res.status(400).send("something went wrong in user get by ID API");
    }
})

app.get('/feed', async (req, res) => {
    try {
        const feed = await User.find({});
        if (!feed) {
            res.status(401).send("data not found in feed API");
        } else {
            res.send(feed);
        }
    } catch (error) {
        res.status(400).send("something went wrong in feed API");
    }
})

app.get('/user', async (req, res) => {
    console.log(req.body.emailId);
    try {
        const user = await User.find({ emailId: req.body.emailId });
        if (!user) {
            res.status(401).send("data not found");
        } else {
            res.send(user)
        }
    } catch (error) {
        res.status(400).send("something went wrong in user data");
    }
})

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
})

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


