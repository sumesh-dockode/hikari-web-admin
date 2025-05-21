'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export default function usePaginatedProducts(options: {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  category?: number;
}) {
  const { status } = useSession();

  const fetchProducts = async () => {
    let url = `${API_ROUTES.products}`;
    let params = [];

    if (options?.pageIndex || options?.pageIndex === 0) {
      params.push(`page=${options.pageIndex + 1}`);
    }
    if (options?.pageSize) {
      params.push(`page_size=${options.pageSize}`);
    }
    if (options?.search) {
      params.push(`q=${options.search}`);
    }
    if (options?.category) {
      params.push(`category=${options.category}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    const { data } = await apiClient.get(url);

    return data;
  };
  return useQuery({
    queryKey: ['productTable', options],
    queryFn: fetchProducts,
    enabled: status === 'authenticated',
  });
}
