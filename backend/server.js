import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import helmet from 'helmet';
import morgan from 'morgan';
import fileupload from 'express-fileupload';
import cors from 'cors';
import xss from 'xss-clean';
import hpp from 'hpp';

import connectDB from './database/db.js';
import ErrorHandler from './middleware/errorHandler.js';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

// routes //
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/usersRoute.js';
import productRoutes from './routes/productRoute.js';
import reviewsRoute from './routes/reviewsRoute.js';

const app = express();
connectDB();

// middlewares //
// additional headers to secure request //
app.use(helmet());
// middleware to accept json content //
app.use(express.json());
// file uploading //
app.use(fileupload());
// prevent cross site scripting attack //
app.use(xss());
// prevent http param polution //
app.use(hpp());
// cross domain access //
app.use(cors());

// set static folder //
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// routes //
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewsRoute);
app.use(ErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `App is running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow
      .bold
  )
);
