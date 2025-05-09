'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { StoreManagerDataType } from '@/data/store-manager-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useCreateStoreManager() {
  const session = useSession();

  const createStoreManager = async (
    storeManagerData: StoreManagerDataType
  ): Promise<StoreManagerDataType> => {
    if (!session) throw new Error('Session not found');

    let url = `${API_ROUTES.salesman}`;
    const { data } = await apiClient.post(url, storeManagerData);

    return data as Promise<StoreManagerDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StoreManagerDataType) => createStoreManager(data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['storeManager', response.id?.toString()],
        response
      );
    },
  });
}
