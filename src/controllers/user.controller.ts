import { Request, Response, NextFunction } from "express";
import * as userService from "../service/user.service";
import { ApiError } from "../middlewares/global/api.error";
import { insertUserSchema } from "../utils/validation.user";
import bcrypt from "bcryptjs";

/**
 * Retrieves all users from the database.
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
 * //       "email": "user1@example.com",
 * //       "password": "$2a$10$hashedpassword1",
 * //       "first_name": "John",
 * //       "last_name": "Doe",
 * //       "role_id": 1,
 * //       "created_at": "2024-01-01T00:00:00.000Z",
 * //       "updated_at": "2024-01-01T00:00:00.000Z"
 * //     },
 * //     {
 * //       "id": 2,
 * //       "email": "user2@example.com",
 * //       "password": "$2a$10$hashedpassword2",
 * //       "first_name": "Jane",
 * //       "last_name": "Smith",
 * //       "role_id": 2,
 * //       "created_at": "2024-01-02T00:00:00.000Z",
 * //       "updated_at": "2024-01-02T00:00:00.000Z"
 * //     }
 * //   ]
 * // }
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        if (!users || users.length === 0) next(ApiError.notFound("No users found"));
        res.status(200).json({data: users});
    } catch (error) {
        next(error)
    }
}

/**
 * Retrieves a specific user by their ID.
 *
 * @param {Request} req - Express request object. Expects `id` as a URL parameter.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 *
 * @example
 * // Request URL: /users/1
 * //
 * // Success response:
 * // {
 * //   "id": 1,
 * //   "email": "user@example.com",
 * //   "role_id": 1,
 * //   "created_at": "2024-01-01T00:00:00.000Z"
 * // }
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction)=> {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        return next(ApiError.badRequest("Invalid user ID"));
    }
    try {
        const user = await userService.getUserById(userId);
        if (!user) next(ApiError.notFound("User not found"));
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

/**
 * Deletes a user by their ID.
 *
 * @param {Request} req - Express request object. Expects `id` as a URL parameter.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 *
 * @example
 * // Request URL: DELETE /users/1
 * //
 * // Success response:
 * // {
 * //   "message": "User deleted successfully"
 * // }
 */
export const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return next(ApiError.badRequest("Invalid user ID"));
    try {
        const deleted = await userService.deleteUserById(userId);
        if (!deleted) next(ApiError.notFound("User not found or could not be deleted"));
        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        next(error);
    }
}

/**
 * Creates a new user with validated input and hashed password.
 *
 * @param {Request} req - Express request object. Expects user data in `req.body` (email, password, role_id, etc.).
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 *
 * @example
 * // Request body:
 * // {
 * //   "email": "newuser@example.com",
 * //   "password": "securepassword123",
 * //   "role_id": 2,
 * //   "first_name": "John",
 * //   "last_name": "Doe"
 * // }
 * //
 * // Success response:
 * // {
 * //   "id": 3,
 * //   "email": "newuser@example.com",
 * //   "role_id": 2,
 * //   "first_name": "John",
 * //   "last_name": "Doe",
 * //   "created_at": "2024-01-01T00:00:00.000Z"
 * // }
 */
export const insertUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = insertUserSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        }
        const userInput = parsed.data;
        userInput.password = await bcrypt.hash(userInput.password, 10);

        const user = await userService.insertUser(userInput);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        next(error);
    }
};