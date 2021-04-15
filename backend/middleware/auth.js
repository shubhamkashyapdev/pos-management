import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import ErrorResponse from '../utils/errorResponse.js';

// protect routes //
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // set token from bearer token in header //
    token = req.headers.authorization.split(' ')[1];
  }
  // make sure token exists //
  if (!token) {
    return next(new ErrorResponse(`Not Authorized To Access This Route`, 401));
  }
  try {
    // verify token //
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);

    req.user = await User.findById(decoded.user);
    if (!req.user) {
      return next(new ErrorResponse(`User Not Found`, 404));
    }
    console.log(req.user);
    next();
  } catch (err) {
    return next(new ErrorResponse(`Not Authorized To Access This Route`, 401));
  }
});

// Grant access to specific roles //
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User Role ${req.user.role} Is Not Authorized To Access This Route`,
          403
        )
      );
    }
    next();
  };
};
