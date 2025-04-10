'use client';

import { useSession } from 'next-auth/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export default function usePaginatedOrders() {
  const { status } = useSession();

  const fetchOrders = async (pageParam: number = 1) => {
    let url = `${API_ROUTES.orders}?page=${pageParam}&page_size=10`;
    const { data } = await apiClient.get(url);

    return data;
  };
  return useInfiniteQuery({
    queryKey: ['ordersTable'],
    queryFn: ({ pageParam = 1 }) => fetchOrders(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      return lastPage ? lastPageParam + 1 : null;
    },
    enabled: status === 'authenticated',
  });
}
