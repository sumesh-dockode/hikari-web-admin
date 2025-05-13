'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export default function useVariantValue() {
  const { status } = useSession();

  const fetchVariantValues = async () => {
    const url = `${API_ROUTES.variantValues}`;
    const { data } = await apiClient.get(url);
    return data?.results ?? data;
  };

  return useQuery({
    queryKey: ['variantValues'],
    queryFn: fetchVariantValues,
    enabled: status === 'authenticated',
  });
}
