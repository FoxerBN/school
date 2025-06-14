import { Response, NextFunction } from 'express';
import { ApiError } from './global/api.error';
import { AuthRequest } from './auth.middleware';

export const roleMiddleware = (...allowedRoles: number[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return next(ApiError.unauthorized("User not authenticated"));
        if (!allowedRoles.includes(req.user.role)) return next(ApiError.forbidden("You do not have permission !!"));
        next();
    }
}