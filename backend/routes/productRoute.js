import express from 'express';

import { protect, authorize } from '../middleware/auth.js';

import {
  getAllProducts,
  getSingleProduct,
  addProduct,
  updateProductById,
  deleteProductById,
} from '../controllers/productController.js';
const router = express.Router();

router
  .route('/')
  .get(getAllProducts)
  .post(protect, authorize('cashier', 'admin'), addProduct);
router
  .route('/:id')
  .get(getSingleProduct)
  .put(protect, authorize('admin', 'cashier'), updateProductById)
  .delete(protect, authorize('admin', 'cashier'), deleteProductById);

export default router;
