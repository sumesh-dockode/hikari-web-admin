'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useServiceTypesById(id: any) {
  const { status } = useSession();
  const fetchServiceTypes = async () => {
    let url = `${API_ROUTES.serviceTypes}${id}`;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ['serviceTypes', id],
    queryFn: () => fetchServiceTypes(),
    enabled: !!id && status === 'authenticated',
  });
}
