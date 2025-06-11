'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useProductVariantById(variantId: any) {
  const { status } = useSession();
  const fetchProductVariantById = async () => {
    let url = `${API_ROUTES.productvariants}${variantId}`;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ['productVariant', variantId],
    queryFn: () => fetchProductVariantById(),
    enabled: !!variantId && status === 'authenticated',
  });
}
