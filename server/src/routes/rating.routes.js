import { Router } from "express";
import { authUser } from "../middlewares/identifyUser.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
    createRating,
    updateRating
} from "../controllers/rating.controller.js";

const ratingRouter = Router();

ratingRouter.post("/", authUser, authorizeRoles("USER"), createRating);
ratingRouter.patch("/:storeId", authUser, authorizeRoles("USER"), updateRating);

export default ratingRouter;
