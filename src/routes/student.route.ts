import { Router } from "express";
import { getAllStudents, getStudentById } from "../controllers/student.controller";
const studentRouter = Router();

studentRouter.get("/", getAllStudents);
studentRouter.get("/:id", getStudentById);

export default studentRouter;