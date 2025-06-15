import { Router } from "express";
import {getAllUsers, getUserById} from "../controllers/user.controller";
import { roleMiddleware } from "../middlewares/role.middleware";
import { Role } from "../interfaces/models/role.enum"

const userRouter = Router();

userRouter.get("/",roleMiddleware(Role.Admin), getAllUsers);
userRouter.get("/:id",roleMiddleware(Role.Admin), getUserById);

export default userRouter;