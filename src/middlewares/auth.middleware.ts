import { NextFunction, Request, Response } from 'express';
import { ApiError } from './global/api.error';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: number; role: number };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if(req.path === '/login') return next();

    const token = req.cookies.token;
    if(!token) return next(ApiError.unauthorized("No token provided"));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default') as { id: number, role: number };
        req.user = decoded;
        next();
    } catch (error) {
        return next(ApiError.unauthorized("Invalid token"));
    }
}