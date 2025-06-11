'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useGetAllCategories() {
  const { status } = useSession();
  const fetchCategories = async () => {
    let url = API_ROUTES.categories;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
    enabled: status === 'authenticated',
  });
}
