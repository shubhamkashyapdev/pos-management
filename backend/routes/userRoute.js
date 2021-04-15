import express from 'express';

// controllers //
import { getUsers, getUser, addUser } from '../controllers/userController.js';

const router = express.Router();

// routes //
router.route('/').get(getUsers).post(addUser);
router.route('/:id').get(getUser);

export default router;
