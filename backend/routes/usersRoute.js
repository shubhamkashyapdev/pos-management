import express from 'express';
const router = express.Router();
import {
  getUsers,
  addUser,
  updateUser,
  removeUser,
  getUser,
} from '../controllers/userController.js';

// middleware //
import { protect, authorize } from '../middleware/auth.js';

router.use(protect);
router.use(authorize('admin'));
router.route('/').get(getUsers).post(addUser);
router.route('/:id').put(updateUser).delete(removeUser).get(getUser);

export default router;
