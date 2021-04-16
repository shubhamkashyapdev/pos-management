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
  const { fullName, username, email, password, role } = req.body;
  let user = await User.findOne({ username });
  if (user) {
    return next(new ErrorResponse(`User Already Exists`, 400));
  }
  user = await User.create({
    fullName,
    email,
    password,
    username,
    role,
  });
  // send token //
  sendTokenResponse(user, 201, res);
});

// @desc    get current logged in user
// @route   GET /api/users/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    status: 200,
    data: user,
  });
});

// @desc        Login user
// @route       POST   /api/v1/auth/login
// @access      Public
export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  // validate email and password //
  if (!username || !password) {
    return next(new ErrorResponse(`Please Provide An Email And Password`, 400));
  }
  const user = await User.findOne({ username }).select('+password');
  if (!user) {
    return next(new ErrorResponse(`Invalid Credentials`, 401));
  }
  // check if password matches //
  const match = await user.matchPassword(password);
  if (!match) {
    return next(new ErrorResponse(`Invalid Credentials`, 401));
  }
  // send a cookie along with token response //
  sendTokenResponse(user, 200, res);
});

// @desc        Update user details
// @route       PUT   /api/auth/updatedetails
// @access      Private
export const updateUserDetails = asyncHandler(async (req, res, next) => {
  const { fullName, email, username } = req.body;
  const filedsToUpdate = {
    fullName: fullName,
    email: email,
    username: username,
  };
  const userWithEmail = await User.findOne({ email });
  if (userWithEmail) {
    return next(
      new ErrorResponse(`User With This Email Address Already Exists`, 400)
    );
  }
  const userWithUsername = await User.findOne({ username });
  if (userWithUsername) {
    return next(
      new ErrorResponse(`User With This Username Address Already Exists`, 400)
    );
  }
  const user = await User.findByIdAndUpdate(req.user.id, filedsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    status: 200,
    data: user,
  });
});

// @desc        Delete user
// @route       Delete   /api/auth/remove
// @access      Private
export const removeUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse(`No User Found To Delete`, 400));
  }
  user.remove();
  res.status(200).json({
    success: true,
    status: 200,
    data: {},
  });
});

// send token response //
async function sendTokenResponse(user, status, res) {
  const token = await user.getToken();
  res.status(status).json({
    success: true,
    status: 200,
    token,
  });
}
