'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { ProductVariantDataType } from '@/data/products-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useUpdateProductVariant() {
  const { data: session, status } = useSession();

  const updateProductVariant = async (
    variantsData: ProductVariantDataType
  ): Promise<ProductVariantDataType> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.productvariants}${variantsData.id}/`;
    const { data } = await apiClient.patch(url, variantsData);

    return data as Promise<ProductVariantDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductVariantDataType) => updateProductVariant(data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['productVariant', response.id?.toString()],
        response
      );
    },
  });
}
