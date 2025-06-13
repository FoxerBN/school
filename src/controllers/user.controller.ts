import { Request, Response, NextFunction } from "express";
import * as userService from "../service/user.service";
import { ApiError } from "../middlewares/global/api.error";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        if (!users || users.length === 0) throw ApiError.notFound("No users found");
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
        if (!user) throw ApiError.notFound("User not found");
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}