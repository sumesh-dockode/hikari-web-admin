'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useDeleteStoreManager() {
  const { data: session } = useSession();

  const deleteStoreManager = async (storemanagerId: any): Promise<void> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.storeManager}${storemanagerId}`;
    const { data } = await apiClient.delete(url);
    return data;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (storemanagerId: number) => deleteStoreManager(storemanagerId),
    onSuccess: (_, storemanagerId) => {
      queryClient.invalidateQueries({
        queryKey: ['storeManagerTable'],
      });
      queryClient.removeQueries({ queryKey: ['storeManager', storemanagerId] });
    },
  });
}
