import mongoose from 'mongoose';
import Part, { IPart, PartCategory, IPartSpecs } from '../../models/parts.model';

export type PartRow = Pick<
  IPart,
  '_id' | 'name' | 'brand' | 'category' | 'price' | 'stock' | 'image' | 'specs' | 'rating' | 'reviewCount'
> & { createdAt: Date; updatedAt: Date };

export interface ProductFilter {
  category?: PartCategory;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface ProductSort {
  field: 'price' | 'rating' | 'createdAt';
  order: 'asc' | 'desc';
}

export interface CreatePartPayload {
  name: string;
  brand: string;
  category: PartCategory;
  price: number;
  stock: number;
  image?: string;
  specs: IPartSpecs;
}

export interface UpdatePartPayload {
  name?: string;
  brand?: string;
  price?: number;
  stock?: number;
  image?: string;
  specs?: IPartSpecs;
}

const PART_FIELDS = 'name brand category price stock image wattage specs rating reviewCount createdAt updatedAt';

type PartFilter = {
  category?: PartCategory;
  brand?: InstanceType<typeof RegExp>;
  stock?: { $gt: number };
  price?: { $gte?: number; $lte?: number };
  $text?: { $search: string };
};

function buildFilter(filter: ProductFilter): PartFilter {
  const query: PartFilter = {};

  if (filter.category) query.category = filter.category;
  if (filter.brand)    query.brand = new RegExp(filter.brand, 'i');
  if (filter.inStock)  query.stock = { $gt: 0 };

  if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
    query.price = {};
    if (filter.minPrice !== undefined) query.price.$gte = filter.minPrice;
    if (filter.maxPrice !== undefined) query.price.$lte = filter.maxPrice;
  }

  // Use MongoDB text index instead of regex — orders of magnitude faster
  if (filter.search) {
    query.$text = { $search: filter.search };
  }

  return query;
}

function buildSort(sort?: ProductSort): Record<string, 1 | -1> {
  if (!sort) return { createdAt: -1 };
  return { [sort.field]: sort.order === 'asc' ? 1 : -1 };
}

export async function findProducts(
  filter: ProductFilter,
  sort: ProductSort | undefined,
  page: number,
  limit: number,
): Promise<{ products: PartRow[]; total: number }> {
  const query = buildFilter(filter);
  const [products, total] = await Promise.all([
    Part.find(query)
      .select(PART_FIELDS)
      .sort(buildSort(sort))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<PartRow[]>(),
    Part.countDocuments(query),
  ]);
  return { products, total };
}

export async function findProductById(id: mongoose.Types.ObjectId): Promise<PartRow | null> {
  return Part.findById(id).select(PART_FIELDS).lean<PartRow>();
}

export async function findProductsByCategory(
  category: PartCategory,
): Promise<PartRow[]> {
  return Part.find({ category })
    .select(PART_FIELDS)
    .sort({ price: 1 })
    .lean<PartRow[]>();
}

export async function createProduct(payload: CreatePartPayload): Promise<PartRow> {
  const part = await Part.create(payload);
  return part.toObject() as unknown as PartRow;
}

export async function updateProductById(
  id: mongoose.Types.ObjectId,
  patch: UpdatePartPayload,
): Promise<PartRow | null> {
  return Part.findByIdAndUpdate(id, { $set: patch }, { new: true })
    .select(PART_FIELDS)
    .lean<PartRow>();
}

export async function updateProductStock(
  id: mongoose.Types.ObjectId,
  delta: number,
): Promise<PartRow | null> {
  return Part.findByIdAndUpdate(
    id,
    { $inc: { stock: delta } },
    { new: true },
  ).select(PART_FIELDS).lean<PartRow>();
}

export async function deleteProductById(id: mongoose.Types.ObjectId): Promise<void> {
  await Part.findByIdAndDelete(id);
}
