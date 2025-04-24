'use client';


import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { specificationDataType } from '@/data/products-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useCreateSpecifications() {
  const session = useSession();

  const createSpecifications = async (
    specificationData: specificationDataType
  ): Promise<specificationDataType> => {
    if (!session) throw new Error('Session not found');

    console.log('specificationData----', specificationData);

  let url = `${API_ROUTES.specifications}`;
    const { data } = await apiClient.post(url, specificationData);

    return data as Promise<specificationDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: specificationDataType) => createSpecifications(data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['specifications', response.id?.toString()],
        response
      );
    },
  });
}
