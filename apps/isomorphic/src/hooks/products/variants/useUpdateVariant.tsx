'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { variantDataType } from '@/data/products-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useUpdateVariant() {
  const { data: session } = useSession();

  const updateVariants = async (
    variantData: variantDataType
  ): Promise<variantDataType> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.variants}${variantData.id}/`;
    const { data } = await apiClient.patch(url, variantData);

    console.log('data', data);

    return data.data as Promise<variantDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: variantDataType) => updateVariants(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['variants', response.id?.toString()], response);
    },
  });
}
