const express = require("express")
const app = express();
require("./config/database");
const port = 3000;

/* app.use("/test", (req, res) => {
    res.send("Server started nodemon")
})

app.use("/main", (req, res) => {
    res.send("another route")
}) */

app.listen(port, () => {
    console.log("Server started running on port " + port)
})