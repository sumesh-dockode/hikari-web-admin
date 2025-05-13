'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useDeliveryManagerById(id: any) {
  const { status } = useSession();
  const fetchDeliveryManager = async () => {
    let url = `${API_ROUTES.deliveryManager}${id}`;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ['deliveryManager', id],
    queryFn: () => fetchDeliveryManager(),
    enabled: !!id && status === 'authenticated',
  });
}
