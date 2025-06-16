import { Request, Response, NextFunction } from "express";
import * as userService from "../service/user.service";
import { ApiError } from "../middlewares/global/api.error";
import { insertUserSchema } from "../utils/validation.user";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        if (!users || users.length === 0) next(ApiError.notFound("No users found"));
        res.status(200).json({data: users});
    } catch (error) {
        next(error)
    }
}

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