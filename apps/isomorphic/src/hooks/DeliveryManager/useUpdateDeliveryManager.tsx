'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { DeliveryManagerDataType } from '@/data/delivery-manager-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useUpdateDeliveryManager() {
  const { data: session, status } = useSession();

  const updateDeliveryManager = async (
    deliveryManagerData: DeliveryManagerDataType
  ): Promise<DeliveryManagerDataType> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.deliveryManager}${deliveryManagerData.id}/`;
    const { data } = await apiClient.patch(url, deliveryManagerData);

    return data.data as Promise<DeliveryManagerDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDeliveryManager,
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['deliveryManager', response.id?.toString()],
        response
      );
    },
  });
}
