import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getTopSellingJerseys,
  getAllTeams,
  getJerseysByTeam,
  getFeaturedJerseys,
} from '../controllers/productController.js';
import {protect, admin} from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router.get('/top-selling', getTopSellingJerseys);
router.get('/featured', getFeaturedJerseys);
router.get('/teams', getAllTeams);
router.get('/team/:teamName', getJerseysByTeam);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

export default router;
