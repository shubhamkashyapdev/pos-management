import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import helmet from 'helmet';
import path from 'path';

import connectDB from './database/db.js';
dotenv.config();

const app = express();
connectDB();

console.log(process.env.PORT);

// middlewares //
app.use(helmet);
app.use(express.json());

// routes //

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `App is running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow
      .bold
  )
);
