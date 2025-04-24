'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import {
  specificationValueDataType,
  variantDataType,
  variantValuesDataType,
} from '@/data/products-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useCreateSpecificationValue() {
  const session = useSession();

  const createSpecification = async (
    specificationValueData: specificationValueDataType
  ): Promise<specificationValueDataType> => {
    if (!session) throw new Error('Session not found');

    console.log('variantData----', specificationValueData);

    let url = `${API_ROUTES.specificationValues}`;
    const { data } = await apiClient.post(url, specificationValueData);

    return data as Promise<specificationValueDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: specificationValueDataType) => createSpecification(data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['specificationvalue', response.id?.toString()],
        response
      );
    },
  });
}
