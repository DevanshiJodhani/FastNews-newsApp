import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './controller/errorController.js';
import AppError from './utils/appError.js';

// ALL ROUTES FILES
import userRoute from './routes/userRoutes.js';
import postRoute from './routes/postRoutes.js';

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
// MIDDLEWARE TO PARSE JASON
app.use(express.json());

// MIDDLEWARE FOR COKKIES
app.use(cookieParser());

// MIDDLEWARE FOR STATIC FILES
app.use('/public', express.static('public'));

// Development logging
if (process.env.VITE_NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ROUTES
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);

// HANDLING UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
