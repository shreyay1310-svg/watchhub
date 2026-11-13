import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkProductsAction,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.post('/bulk', bulkProductsAction);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
