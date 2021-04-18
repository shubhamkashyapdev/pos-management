import express from 'express';
import {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewsControllers.js';

import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(getReviews).post(protect, addReview);
router
  .route('/:id')
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
