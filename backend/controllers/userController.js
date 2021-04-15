import asyncHandler from 'express-async-handler';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/userModel.js';

// @desc    get all users from database
// @route   GET /api/users
// @access  Public
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    status: 200,
    count: users.length,
    data: users,
  });
});

// @desc    get all users from database
// @route   GET /api/users/:id
// @access  Public
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return new ErrorResponse(`User Not Found With Requested ID`, 404);
  }
  res.status(200).json({
    success: true,
    status: 200,
    data: user,
  });
});

// @desc    create a new user
// @route   POST /api/users
// @access  Private
export const addUser = asyncHandler(async (req, res, next) => {
  const { fullName, username, email, password } = req.body;
  let user = await User.findOne({ username });
  if (user) {
    return new ErrorResponse(`User Already Exists`, 400);
  }
  user = await User.create({
    fullName,
    email,
    password,
    username,
  });
  // send token //
  //sendTokenResponse(user, 201, res);
  //const token = await user.getToken();
  res.status(200).json({
    success: true,
    status: 200,
    data: {},
  });
});

// send token response //
// async function sendTokenResponse(user, status, res) {
//   const token = await user.getToken();
//   res.status(status).json({
//     success: true,
//     status: 200,
//     token,
//   });
// }
