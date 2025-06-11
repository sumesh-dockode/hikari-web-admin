'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { StoreManagerDataType } from '@/data/store-manager-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useCreateStoreManager() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const createStoreManager = async (
    storeManagerData: StoreManagerDataType
  ): Promise<StoreManagerDataType> => {
    if (!session) throw new Error('Session not found');

    const url = API_ROUTES.storeManager;
    const { data } = await apiClient.post(url, storeManagerData);

    return data as StoreManagerDataType;
  };

  return useMutation({
    mutationFn: createStoreManager,
    onSuccess: (response) => {
      // Set specific cache entry
      queryClient.setQueryData(
        ['storeManager', response.id?.toString()],
        response
      );

      // Invalidate list to refetch latest
      queryClient.invalidateQueries({
        queryKey: ['storeManagerList'],
      });
    },

    onError: (error) => {
      console.error('Failed to create store manager:', error);
    },
  });
}
