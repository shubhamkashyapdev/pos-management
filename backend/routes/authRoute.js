import express from 'express';

import { protect } from '../middleware/auth.js';

// controllers //
import {
  getUsers,
  getUser,
  addUser,
  getMe,
  login,
  updateUserDetails,
  removeUser,
} from '../controllers/authController.js';

const router = express.Router();

// routes //
router.route('/me').get(protect, getMe);
router.route('/').get(getUsers);
router.route('/register').post(addUser);
router.route('/update').put(protect, updateUserDetails);
router.route('/remove').delete(protect, removeUser);
router.route('/login').post(login);
router.route('/:id').get(getUser);

export default router;
