'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export default function useVariants() {
  const { status } = useSession();

  const fetchVariants = async () => {
    const { data } = await apiClient.get(API_ROUTES.variants);
    return data;
  };

  return useQuery({
    queryKey: ['variantsList'],
    queryFn: fetchVariants,
    enabled: status === 'authenticated',
  });
}
