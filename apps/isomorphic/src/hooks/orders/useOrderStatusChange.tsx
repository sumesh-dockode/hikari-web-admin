'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { OrderStatusChangeDataType } from '@/data/orders';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export function useOrderStatusChange() {
  const { data: session, status } = useSession();

  const orderStatusChange = async ({
    id,
    ...statusData
  }: OrderStatusChangeDataType): Promise<OrderStatusChangeDataType> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.orderStatusChange}`.replace('{id}', id);
    const { data } = await apiClient.patch(url, statusData);

    console.log('data', data);

    return data.data as Promise<OrderStatusChangeDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OrderStatusChangeDataType) => orderStatusChange(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['orders', response?.id] });
      toast.success('Status changed successfully');
    },
  });
}
