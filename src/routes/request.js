const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");

requestRouter.post("/sendConnectRequest", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user.firstName + ": send connection request successfully");
    } catch (err) {
        res.status(400).send("SEND CONNECTION REQUEST FAILED:" + err.message);
    }
});

module.exports = {
    requestRouter
}