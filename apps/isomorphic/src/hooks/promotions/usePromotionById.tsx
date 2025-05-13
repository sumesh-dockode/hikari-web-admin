'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function usePromotionById(id: any) {
  const { status } = useSession();
  const fetchpromotion = async () => {
    let url = `${API_ROUTES.promotion}${id}/`;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ['promotion', id],
    queryFn: () => fetchpromotion(),
    enabled: !!id && status === 'authenticated',
  });
}
