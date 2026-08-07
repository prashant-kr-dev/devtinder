const express = require("express")
const app = express();
const { adminAuth, userAuth } = require("./middleware/auth");
const { connectDB, PORT } = require("./config/database");
const { User } = require("./models/user");
const port = 3000;

app.use(express.json());

app.patch('/user', async (req, res) => {
    try {

        const userPatch = await User.findByIdAndUpdate({ _id: req.body.userId }, { $set: req.body });
        res.send("user updated successfully");
    } catch (err) {
        res.status(400).send("something went wrong in patch user");
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
    // creating a user instances of the user model
    const user = new User(req.body);
    try {
        await user.save();
        res.send("user added successfully");

    } catch (error) {
        res.status(400).send("Error : saving the user - " + error.message);
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


/* 
// error handling
app.get("/getUserData", (req, res) => {
    try {
        throw new Error("random error");
        res.send("get user data send the response successfully ")
    } catch (err) {
        res.status(500).send("some error occurred from try catch");
    }
})

// always use wild card error in the end
app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("something went wrong");
    }
}) */

/* 
// how to auth user using middleware
app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
    res.send("all data send");
});

app.get("/admin/deletedUser", (req, res) => {
    res.send("admin: user data deleted");
});

app.get("/user", userAuth, (req, res) => {
    res.send("user data send");
}) */

/* 
// middleware
app.use("/user", (req, res, next) => {
    console.log("Handle the route user 1st");
    next();
    // res.send("1st response");
}, (req, res, next) => {
    console.log("Handle the route user 2nd");
    // res.send("2nd response");
    next();
}, (req, res) => {
    console.log("Handle the route user 3rd");
    res.send("3rd response");
}) */

/* 
// Routing and Request Handlers

app.use("/test", (req, res) => {
    res.send("Server started nodemon")
})
app.get("/user/:userId", (req, res) => {
    console.log(req.params);
    res.send({ firstName: "Prashant", lastName: "Pandey" })
});
app.get("/user", (req, res) => {
    console.log(req.query);
    res.send({ firstName: "Prashant", lastName: "Pandey" })
});
app.get("/user", (req, res) => {
    res.send({ firstName: "Prashant", lastName: "Pandey" })
});
app.post("/user", (req, res) => {
    res.send("Data saved in the DataBase")
});
app.delete("/user", (req, res) => {
    res.send("Deleted succssefully")
});

app.use("/main", (req, res) => {
    res.send("another route")
}) */
/* app.listen(port, () => {
    console.log("Server started running on port " + port)
}) */


