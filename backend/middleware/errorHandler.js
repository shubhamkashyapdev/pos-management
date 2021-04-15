import ErrorResoponse from '../utils/errorResponse.js';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // Log to console for dev //
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResoponse(message, 404);
  }

  // Mongoose duplicate key //
  if (err.code === 11000) {
    const message = `Duplicate fields value entered`;
    error = new ErrorResoponse(message, 400);
  }

  // Mongoose validation error //
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResoponse(message, 400);
  }

  res.status(error.status || 500).json({
    success: false,
    status: error.status,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
