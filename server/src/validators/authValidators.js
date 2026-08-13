import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    next();
};

const nameValidation = body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 10, max: 60 })
    .withMessage("Name must be between 10 and 60 characters");

const emailValidation = body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail();

const passwordValidation = body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8-16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character");

const addressValidation = body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 400 })
    .withMessage("Address must not exceed 400 characters");

const registerValidation = [
    nameValidation,
    emailValidation,
    passwordValidation,
    addressValidation,
    validate
];

const loginValidation = [
    emailValidation,
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    validate
];

const changePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 8, max: 16 })
        .withMessage("New password must be 8-16 characters")
        .matches(/[A-Z]/)
        .withMessage("New password must contain at least one uppercase letter")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("New password must contain at least one special character"),
    validate
];

export {
    changePasswordValidation,
    loginValidation,
    registerValidation,
    validate
};

export default registerValidation;
