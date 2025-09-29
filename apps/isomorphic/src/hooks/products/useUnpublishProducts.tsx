'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { productsDataType } from '@/data/products-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useUnpublishProducts() {
  const { data: session, status } = useSession();

  const unpublishProducts = async (
    productId: string
  ): Promise<productsDataType> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.products}${productId}/unpublish/`;
    const { data } = await apiClient.patch(url, {});

    console.log('data', data);

    return data.data as Promise<productsDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unpublishProducts,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['productTable'] });
    },
  });
}