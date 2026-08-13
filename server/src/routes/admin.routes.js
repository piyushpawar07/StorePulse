import { Router } from "express";
import { authUser } from "../middlewares/identifyUser.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
    getDashboard,
    createUser,
    getUsers,
    getUserById,
    createStore,
    getStores,
    getStoreById
} from "../controllers/admin.controller.js";
import {
    createStoreValidation,
    createUserValidation,
    storeIdValidation,
    storesQueryValidation,
    userIdValidation,
    usersQueryValidation
} from "../validators/AdminValidators.js";

const adminRouter = Router();

adminRouter.get("/dashboard", authUser, authorizeRoles("ADMIN"), getDashboard);
adminRouter.post("/users", authUser, authorizeRoles("ADMIN"), createUserValidation, createUser);
adminRouter.get("/users", authUser, authorizeRoles("ADMIN"), usersQueryValidation, getUsers);
adminRouter.get("/users/:id", authUser, authorizeRoles("ADMIN"), userIdValidation, getUserById);
adminRouter.post("/stores", authUser, authorizeRoles("ADMIN"), createStoreValidation, createStore);
adminRouter.get("/stores", authUser, authorizeRoles("ADMIN"), storesQueryValidation, getStores);
adminRouter.get("/stores/:id", authUser, authorizeRoles("ADMIN"), storeIdValidation, getStoreById);

export default adminRouter;
