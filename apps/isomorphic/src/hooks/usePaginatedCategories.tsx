'use client';

import { useSession } from 'next-auth/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export default function usePaginatedCategories() {
  const { status } = useSession();

  const fetchCategories = async (pageParam: number = 1) => {
    let url = `${API_ROUTES.categories}?page=${pageParam}`;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useInfiniteQuery({
    queryKey: ['categories'],
    queryFn: ({ pageParam = 1 }) => fetchCategories(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      // let last = lastPage ? (lastPage as any).next : null;
      return lastPage ? lastPageParam + 1 : null;
      // return lastPage.next ? lastPageParam + 1 : null;
    },
    enabled: status === 'authenticated',
  });
}
