import { Router  } from "express";
import { loginUser } from "../controllers/login.controller";
//TODO add limiter
const authRouter = Router();

authRouter.post("/login", loginUser);

export default authRouter;