import { Router } from "express";
import { authUser } from "../middlewares/identifyUser.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
    getStores,
    getStoreById
} from "../controllers/store.controller.js";

const storeRouter = Router();

storeRouter.get("/", authUser, authorizeRoles("USER"), getStores);
storeRouter.get("/:id", authUser, authorizeRoles("USER"), getStoreById);

export default storeRouter;
