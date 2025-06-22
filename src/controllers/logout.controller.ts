import { Request, Response, NextFunction } from "express";

export const logoutUser = (req:Request, res: Response, next: NextFunction) =>{
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        next(error);
    }
}