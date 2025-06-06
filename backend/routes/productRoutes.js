import express from 'express';
const router = express.Router();
import {getProducts, getProductId} from '../controllers/productController.js';

router.route('/').get(getProducts);
router.route('/:id').get(getProductId);

export default router;
