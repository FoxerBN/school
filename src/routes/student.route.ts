import { Router } from "express";
import { getAllStudents, getStudentById, editStudent } from "../controllers/student.controller";
import { roleMiddleware } from "../middlewares/role.middleware";
import { Role } from "../interfaces/models/role.enum"
const studentRouter = Router();

studentRouter.get("/", getAllStudents);
studentRouter.get("/:id", getStudentById);
studentRouter.put("/:id",roleMiddleware(Role.Admin, Role.Director),editStudent);


export default studentRouter;