import { Request, Response, NextFunction } from "express";
import * as studentService from "../service/student.service";
import { ApiError } from "../middlewares/global/api.error";
import { updateStudent, insertStudentValidate } from "../utils/validation.student"
import { AuthRequest } from "../middlewares/auth.middleware";
const allowedFields = ["first_name", "last_name", "grade", "birth_date"];

/**
 * Retrieves all students from the database.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 *
 * @example
 * // Success response:
 * // {
 * //   "data": [
 * //     {
 * //       "id": 1,
 * //       "first_name": "John",
 * //       "last_name": "Doe",
 * //       "grade": "7A",
 * //       "birth_date": "2008-05-15T00:00:00.000Z",
 * //       "created_by": 1,
 * //       "created_at": "2024-01-01T00:00:00.000Z",
 * //       "updated_at": "2024-01-01T00:00:00.000Z"
 * //     },
 * //     {
 * //       "id": 2,
 * //       "first_name": "Jane",
 * //       "last_name": "Smith",
 * //       "grade": "9B",
 * //       "birth_date": "2007-08-22T00:00:00.000Z",
 * //       "created_by": 2,
 * //       "created_at": "2024-01-02T00:00:00.000Z",
 * //       "updated_at": "2024-01-02T00:00:00.000Z"
 * //     }
 * //   ]
 * // }
 */
export const getAllStudents = async (req: Request, res:Response, next: NextFunction): Promise<void> => {
    try {
        const result = await studentService.getAllStudents();
        if (!result || result.length === 0) throw ApiError.notFound("No students found");
        res.status(200).json({ data: result });
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves a specific student by their ID.
 *
 * @param {Request} req - Express request object. Expects `id` as a URL parameter.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 *
 * @example
 * // Request URL: /students/1
 * //
 * // Success response:
 * // {
 * //   "id": 1,
 * //   "first_name": "John",
 * //   "last_name": "Doe",
 * //   "grade": "3A",
 * //   "birth_date": "2008-05-15T00:00:00.000Z",
 * //   "created_by": 1,
 * //   "created_at": "2024-01-01T00:00:00.000Z",
 * //   "updated_at": "2024-01-01T00:00:00.000Z"
 * // }
 */
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

/**
 * Updates an existing student with validated input data.
 *
 * @param {Request} req - Express request object. Expects `id` as URL parameter and student data in `req.body`.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 *
 * @example
 * // Request URL: PUT /students/1
 * // Request body:
 * // {
 * //   "first_name": "John",
 * //   "last_name": "Smith",
 * //   "grade": "4C",
 * //   "birth_date": "2008-05-15"
 * // }
 * //
 * // Success response:
 * // {
 * //   "id": 1,
 * //   "first_name": "John",
 * //   "last_name": "Smith",
 * //   "grade": "8C",
 * //   "birth_date": "2008-05-15T00:00:00.000Z",
 * //   "created_by": 1,
 * //   "created_at": "2024-01-01T00:00:00.000Z",
 * //   "updated_at": "2024-01-01T12:00:00.000Z"
 * // }
 */
export const editStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId = parseInt(req.params.id);
    if (isNaN(studentId)) {
      return next(ApiError.badRequest("Invalid student ID"));
    }
    
    const parseResult = updateStudent.safeParse(req.body);
    if (!parseResult.success) {
      return next(ApiError.badRequest("Invalid student data"));
    }

    const studentData = parseResult.data;

    for (const key of Object.keys(studentData)) {
  if (!allowedFields.includes(key)) {
    throw new Error(`Field "${key}" is not allowed`);
   }
  }
    const updatedStudent = await studentService.editStudent(studentId, studentData);

    if (!updatedStudent) {
      throw ApiError.notFound("Student not found or no data to update");
    }

    res.status(200).json(updatedStudent);

  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a student by their ID.
 *
 * @param {Request} req - Express request object. Expects `id` as a URL parameter.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 *
 * @example
 * // Request URL: DELETE /students/1
 * //
 * // Success response:
 * // {
 * //   "message": "Student deleted successfully"
 * // }
 */
export const deleteStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const studentId = parseInt(req.params.id);
  if (isNaN(studentId)) {
    return next(ApiError.badRequest("Invalid student ID"));
  }
  try {
    const deleted = await studentService.deleteStudent(studentId);
    if (!deleted) {
      throw ApiError.notFound("Student not found");
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new student with validated input data and authenticated user.
 *
 * @param {AuthRequest} req - Express request object with user authentication. Expects student data in `req.body`.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 *
 * @example
 * // Request body:
 * // {
 * //   "first_name": "Alice",
 * //   "last_name": "Johnson",
 * //   "grade": "4C",
 * //   "birth_date": "2009-03-10"
 * // }
 * //
 * // Success response:
 * // {
 * //   "id": 3,
 * //   "first_name": "Alice",
 * //   "last_name": "Johnson",
 * //   "grade": "4C",
 * //   "birth_date": "2009-03-10T00:00:00.000Z",
 * //   "created_by": 1,
 * //   "created_at": "2024-01-01T00:00:00.000Z",
 * //   "updated_at": "2024-01-01T00:00:00.000Z"
 * // }
 */
export const insertStudent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const parseResult = insertStudentValidate.safeParse(req.body);
  if (!parseResult.success) return next(ApiError.badRequest("Invalid student data"));
  const userId = req.user?.id;
  if (!userId) return next(ApiError.badRequest("User not authenticated"));

  const studentData = {
    ...parseResult.data,
    created_by: userId,
  };

  try {
    const newStudent = await studentService.insertStudent(studentData);
    res.status(201).json(newStudent);
  } catch (error) {
    next(error);
  }
};
