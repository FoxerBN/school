import { Router } from "express";
import { getAllStudents, getStudentById, editStudent,deleteStudent,insertStudent } from "../controllers/student.controller";
import { roleMiddleware } from "../middlewares/role.middleware";
import { Role } from "../interfaces/models/role.enum"
const studentRouter = Router();

studentRouter.get("/", getAllStudents);
studentRouter.get("/:id", getStudentById);
studentRouter.put("/:id",roleMiddleware(Role.Admin, Role.Teacher),editStudent);
studentRouter.delete("/:id", roleMiddleware(Role.Admin, Role.Director), deleteStudent);
studentRouter.post("/", roleMiddleware(Role.Admin, Role.Director), insertStudent);

export default studentRouter;