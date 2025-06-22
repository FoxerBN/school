import { Router  } from "express";
import { loginUser } from "../controllers/login.controller";
import { logoutUser } from "../controllers/logout.controller";
//TODO add limiter
const authRouter = Router();

authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);

export default authRouter;