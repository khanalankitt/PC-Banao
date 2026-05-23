import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Must be a valid ObjectId');

const CATEGORIES = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooler'] as const;

const specsSchema = z.object({
  // CPU
  socket:               z.string().optional(),
  tdp:                  z.number().positive().optional(),
  cores:                z.number().int().positive().optional(),
  baseClock:            z.number().positive().optional(),
  // GPU
  vram:                 z.number().positive().optional(),
  powerConnector:       z.string().optional(),
  length:               z.number().positive().optional(),
  // Motherboard
  formFactor:           z.string().optional(),
  memoryType:           z.string().optional(),
  memorySlots:          z.number().int().positive().optional(),
  maxMemory:            z.number().positive().optional(),
  // RAM
  type:                 z.string().optional(),
  speed:                z.number().positive().optional(),
  capacity:             z.number().positive().optional(),
  // Storage
  storageType:          z.string().optional(),
  interface:            z.string().optional(),
  // PSU
  wattage:              z.number().positive().optional(),
  efficiency:           z.string().optional(),
  modular:              z.enum(['full', 'semi', 'non']).optional(),
  // Case
  supportedFormFactors: z.array(z.string()).optional(),
  maxGpuLength:         z.number().positive().optional(),
  maxCoolerHeight:      z.number().positive().optional(),
  // Cooler
  height:               z.number().positive().optional(),
  supportedSockets:     z.array(z.string()).optional(),
  coolerTdp:            z.number().positive().optional(),
}).passthrough();

export const listProductsSchema = z.object({
  category:  z.enum(CATEGORIES).optional(),
  brand:     z.string().optional(),
  minPrice:  z.coerce.number().min(0).optional(),
  maxPrice:  z.coerce.number().min(0).optional(),
  inStock:   z.coerce.boolean().optional(),
  search:    z.string().trim().min(1).optional(),
  sortBy:    z.enum(['price', 'rating', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page:      z.coerce.number().int().min(1).default(1),
  limit:     z.coerce.number().int().min(1).max(100).default(20),
}).refine(
  (d) => {
    if (d.minPrice !== undefined && d.maxPrice !== undefined) {
      return d.minPrice <= d.maxPrice;
    }
    return true;
  },
  { message: 'minPrice must be less than or equal to maxPrice', path: ['minPrice'] },
);

export const productIdSchema = z.object({
  productId: objectId,
});

export const categoryParamSchema = z.object({
  category: z.enum(CATEGORIES),
});

export const createProductSchema = z.object({
  name:     z.string().trim().min(1).max(200),
  brand:    z.string().trim().min(1).max(100),
  category: z.enum(CATEGORIES),
  price:    z.number().positive(),
  stock:    z.number().int().min(0).default(0),
  image:    z.string().url().optional(),
  specs:    specsSchema,
});

export const updateProductSchema = z.object({
  name:  z.string().trim().min(1).max(200).optional(),
  brand: z.string().trim().min(1).max(100).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  image: z.string().url().optional(),
  specs: specsSchema.optional(),
}).refine(
  (d) => Object.values(d).some((v) => v !== undefined),
  { message: 'Provide at least one field to update' },
);

export const updateStockSchema = z.object({
  // positive = restock, negative = deduct
  delta: z.number().int().refine((n) => n !== 0, { message: 'delta cannot be zero' }),
});

export type ListProductsInput  = z.infer<typeof listProductsSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateStockInput   = z.infer<typeof updateStockSchema>;
