import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { validate } from '../../shared/middlewares/validate.middleware';
import {
  categoryParamSchema,
  createProductSchema,
  listProductsSchema,
  productIdSchema,
  updateProductSchema,
  updateStockSchema,
} from './product.validator';
import {
  create,
  getOne,
  list,
  listByCategory,
  remove,
  update,
  updateStock,
} from './product.controller';

const router = Router();

// ─── public ───────────────────────────────────────────────────────────────────

// GET /api/products?category=cpu&brand=AMD&minPrice=100&search=ryzen&sortBy=price&page=1
router.get('/', validate(listProductsSchema, 'query'), list);

// GET /api/products/category/:category
router.get('/category/:category', validate(categoryParamSchema, 'params'), listByCategory);

// GET /api/products/:productId
router.get('/:productId', validate(productIdSchema, 'params'), getOne);

// ─── admin ────────────────────────────────────────────────────────────────────

// POST /api/products
router.post(
  '/',
  authenticate, authorize('admin'),
  validate(createProductSchema),
  create,
);

// PATCH /api/products/:productId
router.patch(
  '/:productId',
  authenticate, authorize('admin'),
  validate(productIdSchema, 'params'),
  validate(updateProductSchema),
  update,
);

// PATCH /api/products/:productId/stock
router.patch(
  '/:productId/stock',
  authenticate, authorize('admin'),
  validate(productIdSchema, 'params'),
  validate(updateStockSchema),
  updateStock,
);

// DELETE /api/products/:productId
router.delete(
  '/:productId',
  authenticate, authorize('admin'),
  validate(productIdSchema, 'params'),
  remove,
);

export default router;
