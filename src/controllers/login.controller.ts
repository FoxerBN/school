import { Request, Response, NextFunction } from "express";
import * as loginService from "../service/login.service";
import { ApiError } from "../middlewares/global/api.error";

export const loginUser = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    const { email, password } = req.body;
    
    if (!email || !password) {
        return next(ApiError.badRequest("Email and password are required"));
    }
    try {
        const user = await loginService.getUserByEmail(email);
        if(!user) return next(ApiError.notFound("User not found"));

        const isPasswordValid = await loginService.verifyPassword(password, user.password);
        if (!isPasswordValid) return next(ApiError.unauthorized("Invalid password"));

        const token = await loginService.generateToken(user.id, user.role_id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000
        });
        res.status(200).json({
            message: "Login successful",
            user: {
                email: user.email,
                role_id: user.role_id
        }});
    } catch (error) {
        next(error);
    }
}
//TODO check cookie settings 