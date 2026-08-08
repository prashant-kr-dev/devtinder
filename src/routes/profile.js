const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateUserEditData } = require('../utils/validation')

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        res.send(req.user);

    } catch (err) {
        res.status(400).send("PROFILE FAILED:" + err.message);
    }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateUserEditData(req)) {
            throw new Error("invalid error request");
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfuly`,
            data: loggedInUser,
        });

    } catch (err) {
        res.status(400).send("PROFILE FAILED:" + err.message);
    }
});

module.exports = {
    profileRouter
}