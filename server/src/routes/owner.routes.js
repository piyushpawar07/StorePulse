import { Router } from "express";
import { authUser } from "../middlewares/identifyUser.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
    getOwnerDashboard,
    getOwnerRatings
} from "../controllers/owner.controller.js";

const ownerRouter = Router();

ownerRouter.get("/dashboard", authUser, authorizeRoles("STORE_OWNER"), getOwnerDashboard);
ownerRouter.get("/ratings", authUser, authorizeRoles("STORE_OWNER"), getOwnerRatings);

export default ownerRouter;
