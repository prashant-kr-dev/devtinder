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

const validateUserEditData = (req) => {
    const allowedUserEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills"
    ];

    const isEditAllowed = Object.keys(req.body).every(field =>
         allowedUserEditFields.includes(field)
        );
    return isEditAllowed;
};

module.exports = {
    validateSignUpData,
    validateUserEditData
};