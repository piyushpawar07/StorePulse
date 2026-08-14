import { Router } from "express";
const authRouter = Router();
import {authregister} from "../controllers/auth.controller.js";
import {authlogin} from "../controllers/auth.controller.js";
import {logout} from "../controllers/auth.controller.js";
import {authUser} from "../middlewares/identifyUser.js";
import {authGetMe} from "../controllers/auth.controller.js";
import {changePassword} from "../controllers/auth.controller.js";
import {
    changePasswordValidation,
    loginValidation,
    registerValidation
} from "../validators/authValidators.js";

authRouter.post("/register", registerValidation, authregister);
authRouter.post("/login", loginValidation, authlogin);
authRouter.post("/logout", logout);
authRouter.get("/getMe", authUser, authGetMe);
authRouter.patch("/password", authUser, changePasswordValidation, changePassword);



export default authRouter;
