import express from 'express';

import { protect, authorize } from '../middleware/auth.js';

import {
  getAllProducts,
  getSingleProduct,
  addProduct,
  updateProductById,
  deleteProductById,
  productPhotoUpload,
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

router
  .route('/:id/image')
  .put(protect, authorize('admin', 'cashier'), productPhotoUpload);

export default router;
