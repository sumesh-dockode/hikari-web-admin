'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useStoreManagerById(id: any) {
  const { status } = useSession();
  const fetchStoreManager = async () => {
    let url = `${API_ROUTES.storeManager}${id}`;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ['storeManager', id],
    queryFn: () => fetchStoreManager(),
    enabled: !!id && status === 'authenticated',
  });
}
