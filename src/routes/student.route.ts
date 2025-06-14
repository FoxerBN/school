import { Router } from "express";
import { getAllStudents, getStudentById } from "../controllers/student.controller";
import { roleMiddleware } from "../middlewares/role.middleware";
import { Role } from "../interfaces/models/role.enum"
const studentRouter = Router();

studentRouter.get("/", getAllStudents);
studentRouter.get("/:id",roleMiddleware(Role.Admin), getStudentById);

export default studentRouter;