'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { specificationDataType, variantDataType } from '@/data/products-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useUpdateSpecification() {
  const { data: session } = useSession();

  const updateSpecification = async (
    specificationData: specificationDataType
  ): Promise<specificationDataType> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.specifications}${specificationData.id}/`;
    const { data } = await apiClient.patch(url, specificationData);

    console.log('data', data);

    return data.data as Promise<specificationDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: specificationDataType) => updateSpecification(data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['specificationsList', response.id?.toString()],
        response
      );
    },
  });
}
