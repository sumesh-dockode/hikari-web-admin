'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { DeliveryManagerDataType } from '@/data/delivery-manager-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useCreateDeliveryManager() {
  const session = useSession();

  const createDeliveryManager = async (
    deliveryManagerData: DeliveryManagerDataType
  ): Promise<DeliveryManagerDataType> => {
    if (!session) throw new Error('Session not found');

    let url = `${API_ROUTES.deliveryManager}`;
    const { data } = await apiClient.post(url, deliveryManagerData);

    return data as Promise<DeliveryManagerDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeliveryManagerDataType) => createDeliveryManager(data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['deliveryManager', response.id?.toString()],
        response
      );
    },
  });
}
