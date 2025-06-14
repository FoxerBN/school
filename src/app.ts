import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Our custom body validation middleware
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
app.use('/api/students', studentRouter);
app.use('/api/users', userRouter);

// Global Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;