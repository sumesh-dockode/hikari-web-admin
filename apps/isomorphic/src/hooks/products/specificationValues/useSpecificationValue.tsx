'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export default function useSpecificationValue() {
  const { status } = useSession();

  const fetchSpecificationValues = async () => {
    const { data } = await apiClient.get(API_ROUTES.specificationValues);
    return data;
  };

  return useQuery({
    queryKey: ['specificationValue'],
    queryFn: fetchSpecificationValues,
    enabled: status === 'authenticated',
  });
}
