'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { serviceStatusChangeDataType } from '@/data/service-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export function useServiceStatusChange() {
  const { data: session, status } = useSession();

  const serviceStatusChange = async ({
    id,
    ...statusData
  }: serviceStatusChangeDataType): Promise<serviceStatusChangeDataType> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.serviceStatusChange}`.replace('{id}', id);
    const { data } = await apiClient.patch(url, statusData);

    console.log('data', data);

    return data.data as Promise<serviceStatusChangeDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: serviceStatusChangeDataType) => serviceStatusChange(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['services', response?.id] });
      toast.success('Status changed successfully');
    },
  });
}
