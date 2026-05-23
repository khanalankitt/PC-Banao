import api from './axios';

export interface IPart {
  _id: string;
  name: string;
  brand: string;
  category: 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooler';
  price: number;
  stock: number;
  images: string[];
  specs: Record<string, unknown>;
  wattage?: number;
}

// Backend returns `image: string` — normalise to the frontend shape
function normalise(raw: Record<string, unknown>): IPart {
  const specs = (raw.specs ?? {}) as Record<string, unknown>;
  return {
    _id:      raw._id as string,
    name:     raw.name as string,
    brand:    raw.brand as string,
    category: raw.category as IPart['category'],
    price:    raw.price as number,
    stock:    raw.stock as number,
    images:   raw.image ? [raw.image as string] : [],
    specs,
    wattage:  (raw.wattage as number | undefined)
           ?? (specs.wattage as number | undefined)
           ?? (specs.tdp    as number | undefined),
  };
}

export interface ListProductsParams {
  category?: IPart['category'];
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ListProductsResponse {
  products: IPart[];
  total: number;
  page: number;
  totalPages: number;
}

export async function listProducts(params: ListProductsParams = {}): Promise<ListProductsResponse> {
  const { data } = await api.get<{ data: { products: Record<string, unknown>[]; total: number; page: number; totalPages?: number } }>(
    '/api/products', { params },
  );
  const raw = data.data;
  return {
    products:   raw.products.map(normalise),
    total:      raw.total,
    page:       raw.page,
    totalPages: raw.totalPages ?? Math.ceil(raw.total / (params.limit ?? 20)),
  };
}

export async function getProduct(id: string): Promise<IPart> {
  const { data } = await api.get<{ data: Record<string, unknown> }>(`/api/products/${id}`);
  return normalise(data.data);
}
