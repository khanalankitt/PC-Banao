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
  const { data } = await api.get<{ data: ListProductsResponse }>('/api/products', { params });
  return data.data;
}

export async function getProduct(id: string): Promise<IPart> {
  const { data } = await api.get<{ data: IPart }>(`/api/products/${id}`);
  return data.data;
}
