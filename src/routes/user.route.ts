import { Router } from "express";
import {getAllUsers, getUserById} from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);

export default userRouter;