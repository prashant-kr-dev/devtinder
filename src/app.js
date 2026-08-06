const express = require("express")
const app = express();
require("./config/database");
const port = 3000;

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
})

app.listen(port, () => {
    console.log("Server started running on port " + port)
})