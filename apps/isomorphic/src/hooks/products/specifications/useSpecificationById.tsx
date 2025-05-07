'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useSpecificationById(specificationId: any) {
  const { status } = useSession();
  const fetchSpecifications = async () => {
    let url = `${API_ROUTES.specifications}${specificationId}`;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ['specifications', specificationId],
    queryFn: () => fetchSpecifications(),
    enabled: !!specificationId && status === 'authenticated',
  });
}
