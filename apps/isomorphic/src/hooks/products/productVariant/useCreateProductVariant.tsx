'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import {
  ProductVariantDataType,
} from '@/data/products-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useCreateProductVariant() {
  const session = useSession();

  const createProductVariant = async (
    productVariantData: ProductVariantDataType
  ): Promise<ProductVariantDataType> => {
    if (!session) throw new Error('Session not found');

    console.log('productvariantData----', productVariantData);

    let url = `${API_ROUTES.specifications}`;
    const { data } = await apiClient.post(url, productVariantData);

    return data as Promise<ProductVariantDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductVariantDataType) => createProductVariant(data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['specifications', response.id?.toString()],
        response
      );
    },
  });
}
