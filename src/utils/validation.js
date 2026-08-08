const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First Name or Last Name is missing");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Enter valid Email id");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter valid password");
    }
};

module.exports = {
    validateSignUpData
};