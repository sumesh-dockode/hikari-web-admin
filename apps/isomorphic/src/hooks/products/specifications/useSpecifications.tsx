'use client';

import { useSession } from 'next-auth/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export default function useSpecifications() {
  const { status } = useSession();

  const fetchSpecifications = async (pageParam: number = 1) => {
    let url = `${API_ROUTES.specifications}`;
    const { data } = await apiClient.get(url);

    return data;
  };
  return useInfiniteQuery({
    queryKey: ['specificationsList'],
    queryFn: ({ pageParam = 1 }) => fetchSpecifications(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      return lastPage ? lastPageParam + 1 : null;
    },
    enabled: status === 'authenticated',
  });
}
