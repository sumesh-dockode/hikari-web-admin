'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { CategoryDataType } from '@/data/product-categories';
import { productsDataType } from '@/data/products-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useUpdateProducts() {
  const { data: session, status } = useSession();

  const updateProducts = async (
    productData: productsDataType
  ): Promise<productsDataType> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.categories}${productData.id}`;
    const { data } = await apiClient.patch(url, productData);

    console.log('data', data);

    return data.data as Promise<productsDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: productsDataType) => updateProducts(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['products', response.id?.toString()], response);
    },
  });
}
