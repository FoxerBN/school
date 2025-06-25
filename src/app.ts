import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { rateLimiter } from './middlewares/rate.limiter';
import path from "path";
dotenv.config();

import { validateBody } from './middlewares/global/validate.body';
import { notFound } from './middlewares/global/not.found';
import { errorHandler } from './middlewares/global/error.handler';
import { MessageResponse } from './interfaces/MessageResponse';
import "./config/postgres.db"; 
const app = express();
app.use(express.static("public"));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(rateLimiter);

app.use(express.json(), validateBody);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// Importing routes
import userRouter from './routes/user.route';
import studentRouter from './routes/student.route';
import authRouter from './routes/auth.route';
import { authMiddleware } from './middlewares/auth.middleware';
app.use('/api/', authRouter);

app.use(authMiddleware);
app.use('/api/students', studentRouter);
app.use('/api/users', userRouter);

// Global Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;