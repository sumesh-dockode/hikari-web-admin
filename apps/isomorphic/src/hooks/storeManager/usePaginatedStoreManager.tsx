'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export default function usePaginatedStoreManager(options: {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
}) {
  const { status } = useSession();

  const fetchStoreManager = async () => {
    let url = API_ROUTES.storeManager;
    let params = [];

    if (options?.pageIndex || options?.pageIndex === 0) {
      params.push(`page=${options.pageIndex + 1}`);
    }
    if (options?.pageSize) {
      params.push(`page_size=${options.pageSize}`);
    }
    if (options?.search) {
      params.push(`search=${options.search}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    const { data } = await apiClient.get(url);

    // Log the full API response with detailed structure
    console.log('Store Manager API Full Response:', JSON.stringify(data, null, 2));

    return data;
  };
  return useQuery({
    // queryKey: ['storeManagerTable', options],
    queryKey: ['storeManagerTable', options.pageIndex, options.pageSize, options.search],

    queryFn: fetchStoreManager,
    enabled: status === 'authenticated',
    throwOnError(error, query) {
      throw error;
    },
  });
}
