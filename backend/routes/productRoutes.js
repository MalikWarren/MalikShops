import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductId,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import {protect, admin} from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router
  .route('/:id')
  .get(getProductId)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
