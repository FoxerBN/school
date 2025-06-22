import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

import { validateBody } from './middlewares/global/validate.body';
import { notFound } from './middlewares/global/not.found';
import { errorHandler } from './middlewares/global/error.handler';
import { MessageResponse } from './interfaces/MessageResponse';
import "./config/postgres.db"; 
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(cookieParser());

app.use(express.json(), validateBody);

// Basic route
app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Hi there!',
  });
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