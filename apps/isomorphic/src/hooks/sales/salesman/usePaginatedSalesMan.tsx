'use client';

import { useSession } from 'next-auth/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export default function usePaginatedSalesMan(options: {
  pageIndex: number;
  pageSize: number;
}) {
  const { status } = useSession();

  const fetchSalesMan = async () => {
    let url = `${API_ROUTES.salesman}?page=${options.pageIndex + 1}&page_size=${options.pageSize}`;
    const { data } = await apiClient.get(url);

    return data;
  };
  return useInfiniteQuery({
    queryKey: ['salesManTable', options],
    queryFn: fetchSalesMan,
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
