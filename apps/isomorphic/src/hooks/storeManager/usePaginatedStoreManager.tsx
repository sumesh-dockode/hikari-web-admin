'use client';

import { useSession } from 'next-auth/react';
import { useInfiniteQuery } from '@tanstack/react-query';
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

    if (options?.pageIndex) {
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

    return data;
  };
  return useInfiniteQuery({
    queryKey: ['storeManagerTable', options],
    queryFn: fetchStoreManager,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data?.next) return undefined;
      return allPages.length + 1;
    },
    enabled: status === 'authenticated',
    throwOnError(error, query) {
      throw error;
    },
  });
}
