import { body, param, query, validationResult } from "express-validator";

const allowedRoles = ["ADMIN", "USER", "STORE_OWNER"];
const allowedUserSortColumns = ["name", "email", "address", "role", "createdAt"];
const allowedStoreSortColumns = ["name", "email", "address", "rating", "createdAt"];

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
    .withMessage("Name must be between 20 and 60 characters");

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

const positiveIdValidation = (field, message) =>
    body(field)
        .isInt({ min: 1 })
        .withMessage(message)
        .toInt();

const idParamValidation = (message) =>
    param("id")
        .isInt({ min: 1 })
        .withMessage(message)
        .toInt();

const paginationValidation = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive number")
        .toInt(),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100")
        .toInt(),
    query("order")
        .optional()
        .isIn(["asc", "desc", "ASC", "DESC"])
        .withMessage("Order must be asc or desc")
];

const createUserValidation = [
    nameValidation,
    emailValidation,
    passwordValidation,
    addressValidation,
    body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required")
        .isIn(allowedRoles)
        .withMessage("Role must be one of ADMIN, USER, STORE_OWNER"),
    validate
];

const createStoreValidation = [
    nameValidation,
    emailValidation,
    addressValidation,
    positiveIdValidation("ownerId", "Invalid owner id"),
    validate
];

const userIdValidation = [
    idParamValidation("Invalid user id"),
    validate
];

const storeIdValidation = [
    idParamValidation("Invalid store id"),
    validate
];

const usersQueryValidation = [
    ...paginationValidation,
    query("sortBy")
        .optional()
        .isIn(allowedUserSortColumns)
        .withMessage("Invalid user sort column"),
    query("role")
        .optional()
        .if(query("role").exists())
        .customSanitizer((role) => String(role).toUpperCase())
        .isIn(allowedRoles)
        .withMessage("Role must be one of ADMIN, USER, STORE_OWNER"),
    validate
];

const storesQueryValidation = [
    ...paginationValidation,
    query("sortBy")
        .optional()
        .isIn(allowedStoreSortColumns)
        .withMessage("Invalid store sort column"),
    validate
];

function getPagination(queryParams) {
    const page = Math.max(Number.parseInt(queryParams.page, 10) || 1, 1);
    const rawLimit = Math.max(Number.parseInt(queryParams.limit, 10) || 10, 1);
    const limit = Math.min(rawLimit, 100);
    const offset = (page - 1) * limit;

    return { page, limit, offset };
}

function getSort(queryParams, allowedSortColumns) {
    const sortBy = allowedSortColumns[queryParams.sortBy] ? queryParams.sortBy : "createdAt";
    const sortColumn = allowedSortColumns[sortBy];
    const order = String(queryParams.order).toLowerCase() === "asc" ? "ASC" : "DESC";

    return { sortColumn, order };
}

export {
    createStoreValidation,
    createUserValidation,
    getPagination,
    getSort,
    storeIdValidation,
    storesQueryValidation,
    userIdValidation,
    usersQueryValidation,
    validate
};
