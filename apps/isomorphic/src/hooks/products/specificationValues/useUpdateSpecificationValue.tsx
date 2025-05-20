'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import {
  specificationValueDataType,
  variantValuesDataType,
} from '@/data/products-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useUpdateSpecificationValue() {
  const { data: session } = useSession();

  const updateSpecificationValue = async (
    specificationValueData: specificationValueDataType
  ): Promise<specificationValueDataType> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.specificationValues}${specificationValueData.id}`;
    const { data } = await apiClient.patch(url, specificationValueData);

    console.log('data', data);

    return data.data as Promise<specificationValueDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: specificationValueDataType) =>
      updateSpecificationValue(data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['specificationValue', response.id?.toString()],
        response
      );
    },
  });
}
