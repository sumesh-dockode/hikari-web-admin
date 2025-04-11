'use client';

import { useSession } from 'next-auth/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export default function usePaginatedOrders({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
} = {}) {
  const { status } = useSession();

  const fetchOrders = async ({
    pageParam = page,
  }: { pageParam?: number } = {}) => {
    let url = `${API_ROUTES.orders}?page=${pageParam}&page_size=${pageSize}`;
    const { data } = await apiClient.get(url);

    return data;
  };
  return useInfiniteQuery({
    queryKey: ['ordersTable', page, pageSize],
    queryFn: fetchOrders,
    initialPageParam: page,
    getNextPageParam: (lastPage, allPages) => {
      // If there's no next page URL, return undefined to stop fetching
      if (!lastPage.next) return undefined;
      return allPages.length + 1;
    },
    enabled: status === 'authenticated',
  });
}
