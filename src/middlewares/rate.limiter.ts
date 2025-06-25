import { Request, Response, NextFunction } from 'express';

interface RateRecord {
  count: number;
  firstRequestTime: number;
}

const rateLimitWindowMs = 15 * 60 * 1000; // 15 minutes
const maxRequests = 100;
const ipStore = new Map<string, RateRecord>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || '';
  const now = Date.now();
  const record = ipStore.get(ip);
  if (!record || now - record.firstRequestTime > rateLimitWindowMs) {
    ipStore.set(ip, { count: 1, firstRequestTime: now });
    return next();
  }
  record.count += 1;
  if (record.count > maxRequests) {
    return res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
  next();
}
