import mongoose from 'mongoose';
import { AppError } from '../../shared/types';
import {
  PartRow,
  ProductFilter,
  ProductSort,
  createProduct,
  deleteProductById,
  findProductById,
  findProducts,
  findProductsByCategory,
  updateProductById,
  updateProductStock,
} from './product.repository';
import {
  CreateProductInput,
  ListProductsInput,
  UpdateProductInput,
  UpdateStockInput,
} from './product.validator';
import { PartCategory } from '../../models/parts.model';

export interface ProductListResult {
  products: PartRow[];
  total: number;
  page: number;
  limit: number;
}

export async function listProducts(input: ListProductsInput): Promise<ProductListResult> {
  const filter: ProductFilter = {
    category: input.category as PartCategory | undefined,
    brand:    input.brand,
    minPrice: input.minPrice,
    maxPrice: input.maxPrice,
    inStock:  input.inStock,
    search:   input.search,
  };

  const sort: ProductSort | undefined =
    input.sortBy
      ? { field: input.sortBy, order: input.sortOrder ?? 'asc' }
      : undefined;

  const { products, total } = await findProducts(filter, sort, input.page, input.limit);
  return { products, total, page: input.page, limit: input.limit };
}

export async function getProduct(productId: string): Promise<PartRow> {
  const product = await findProductById(new mongoose.Types.ObjectId(productId));
  if (!product) throw new AppError('Product not found', 404);
  return product;
}

export async function getProductsByCategory(category: string): Promise<PartRow[]> {
  return findProductsByCategory(category as PartCategory);
}

export async function createNewProduct(input: CreateProductInput): Promise<PartRow> {
  return createProduct({
    name:     input.name,
    brand:    input.brand,
    category: input.category,
    price:    input.price,
    stock:    input.stock,
    image:    input.image,
    specs:    input.specs,
  });
}

export async function updateProduct(
  productId: string,
  input: UpdateProductInput,
): Promise<PartRow> {
  const product = await findProductById(new mongoose.Types.ObjectId(productId));
  if (!product) throw new AppError('Product not found', 404);

  const updated = await updateProductById(new mongoose.Types.ObjectId(productId), input);
  return updated!;
}

export async function adjustStock(
  productId: string,
  input: UpdateStockInput,
): Promise<PartRow> {
  const product = await findProductById(new mongoose.Types.ObjectId(productId));
  if (!product) throw new AppError('Product not found', 404);

  const newStock = product.stock + input.delta;
  if (newStock < 0) {
    throw new AppError(
      `Insufficient stock: current stock is ${product.stock}, cannot reduce by ${Math.abs(input.delta)}`,
      409,
    );
  }

  const updated = await updateProductStock(new mongoose.Types.ObjectId(productId), input.delta);
  return updated!;
}

export async function deleteProduct(productId: string): Promise<void> {
  const product = await findProductById(new mongoose.Types.ObjectId(productId));
  if (!product) throw new AppError('Product not found', 404);
  await deleteProductById(new mongoose.Types.ObjectId(productId));
}
