'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useDeleteDeliveryManager() {
  const { data: session } = useSession();

  const deleteDeliveryManager = async (
    deliveryManagerId: any
  ): Promise<void> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.deliveryManager}${deliveryManagerId}/`;
    const { data } = await apiClient.delete(url);
    return data;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deliveryManagerId: number) =>
      deleteDeliveryManager(deliveryManagerId),
    onSuccess: (_, deliveryManagerId) => {
      queryClient.invalidateQueries({
        queryKey: ['deliveryManagerTable'],
      });
      queryClient.removeQueries({
        queryKey: ['deliveryManager', deliveryManagerId],
      });
    },
  });
}
