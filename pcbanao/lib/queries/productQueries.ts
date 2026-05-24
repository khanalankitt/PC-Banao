import { useQuery } from '@tanstack/react-query';
import { listProducts, getProduct, ListProductsParams } from '@/lib/api/productApi';

export const productKeys = {
  all: ['products'] as const,
  list: (params: ListProductsParams) => ['products', 'list', params] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
};

export function useProducts(params: ListProductsParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => listProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
}
