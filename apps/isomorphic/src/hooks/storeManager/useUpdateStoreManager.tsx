'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { StoreManagerDataType } from '@/data/store-manager-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useUpdateStoreManager() {
  const { data: session, status } = useSession();

  const updateStoreManager = async (
    storeManagerData: StoreManagerDataType
  ): Promise<StoreManagerDataType> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.storeManager}${storeManagerData.id}`;
    const { data } = await apiClient.patch(url, storeManagerData);

    return data.data as Promise<StoreManagerDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StoreManagerDataType) => updateStoreManager(data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['storeManager', response.id?.toString()],
        response
      );
    },
  });
}
