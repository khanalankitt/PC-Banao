import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { sendSuccess } from '../../shared/utils/apiResponse';
import {
  CreateProductInput,
  ListProductsInput,
  UpdateProductInput,
  UpdateStockInput,
} from './product.validator';
import {
  adjustStock,
  createNewProduct,
  deleteProduct,
  getProduct,
  getProductsByCategory,
  listProducts,
  updateProduct,
} from './product.service';

// ─── public ───────────────────────────────────────────────────────────────────

export const list = asyncHandler(async (req: Request, res: Response) => {
  const result = await listProducts(req.query as unknown as ListProductsInput);
  sendSuccess(res, result, 'Products fetched');
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const product = await getProduct(req.params['productId'] as string);
  sendSuccess(res, product, 'Product fetched');
});

export const listByCategory = asyncHandler(async (req: Request, res: Response) => {
  const products = await getProductsByCategory(req.params['category'] as string);
  sendSuccess(res, products, 'Products fetched');
});

// ─── admin ────────────────────────────────────────────────────────────────────

export const create = asyncHandler(async (req: Request, res: Response) => {
  const product = await createNewProduct(req.body as CreateProductInput);
  sendSuccess(res, product, 'Product created', 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const product = await updateProduct(
    req.params['productId'] as string,
    req.body as UpdateProductInput,
  );
  sendSuccess(res, product, 'Product updated');
});

export const updateStock = asyncHandler(async (req: Request, res: Response) => {
  const product = await adjustStock(
    req.params['productId'] as string,
    req.body as UpdateStockInput,
  );
  sendSuccess(res, product, 'Stock updated');
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await deleteProduct(req.params['productId'] as string);
  sendSuccess(res, null, 'Product deleted');
});
