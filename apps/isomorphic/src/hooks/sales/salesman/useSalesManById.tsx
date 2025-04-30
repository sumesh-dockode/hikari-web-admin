'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useSalesManById(id: any) {
  const { status } = useSession();
  const fetchSalesman = async () => {
    let url = `${API_ROUTES.salesman}${id}`;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ['salesman', id],
    queryFn: () => fetchSalesman(),
    enabled: !!id && status === 'authenticated',
  });
}
