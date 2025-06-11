'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useSpecificationValueById(specificationValueId: any) {
  const { status } = useSession();
  const fetchSpecifications = async () => {
    let url = `${API_ROUTES.specificationValues}${specificationValueId}`;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ['specificationValue', specificationValueId],
    queryFn: () => fetchSpecifications(),
    enabled: !!specificationValueId && status === 'authenticated',
  });
}
