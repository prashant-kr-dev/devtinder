const adminAuth = (req, res, next) => {
    console.log("admin middleware called");
    const token = "validAdminToken";
    const isAdminUser = token === "validAdminToken";
    if (!isAdminUser) {
        res.status(401).send("Unauthorized admin");
    }
    else {
        next();
    }
};

const userAuth = (req, res, next) => {
    console.log("user middleware");
    const token = "validTokenUser1";
    const isValidUser = token === "validTokenUser";
    if (!isValidUser) {
        res.status(401).send("invalid user");
    } else {
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
};