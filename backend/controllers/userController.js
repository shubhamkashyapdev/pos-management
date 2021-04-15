import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '../utils/errorResponse.js';

// @desc        Get all users
// @route       GET   /api/v1/users
// @access      Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    status: 200,
    count: users.length,
    data: users,
  });
});

// @desc        Get single user
// @route       GET   /api/v1/users/:id
// @access      Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }
  res.status(200).json({
    success: true,
    status: 200,
    data: user,
  });
});

// @desc        Create user
// @route       POST   /api/v1/users/
// @access      Private/Admin
export const addUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    data: user,
  });
});

// @desc        Crete user
// @route       PUT   /api/v1/users/:id
// @access      Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc        remove user
// @route       Delete   /api/v1/users/:id
// @access      Private/Admin
export const removeUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndRemove(req.user.id);
  res.status(200).json({
    success: true,
    msg: 'User Removed',
    data: {},
  });
});
