import { Request, Response, NextFunction } from "express";
import * as studentService from "../service/student.service";
import { ApiError } from "../middlewares/global/api.error";

export const getAllStudents = async (req: Request, res:Response, next: NextFunction): Promise<void> => {
    try {
        const result = await studentService.getAllStudents();
        if (!result || result.length === 0) throw ApiError.notFound("No students found");
        res.status(200).json({ data: result });
    } catch (error) {
        next(error);
    }
}

export const getStudentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const studentId = parseInt(req.params.id);
    if (isNaN(studentId)) {
        return next(ApiError.badRequest("Invalid student ID"));
    }
    try {
        const result = await studentService.getStudentById(studentId);
        if (!result) throw ApiError.notFound("Student not found");
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}