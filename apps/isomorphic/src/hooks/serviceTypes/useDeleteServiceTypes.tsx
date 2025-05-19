'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useDeleteServiceTypes() {
  const { data: session } = useSession();

  const deleteServiceTypes = async (serviceTypeId: any): Promise<void> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.serviceTypes}${serviceTypeId}/`;
    const { data } = await apiClient.delete(url);
    return data;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceTypeId: number) => deleteServiceTypes(serviceTypeId),
    onSuccess: (_, serviceTypeId) => {
      queryClient.invalidateQueries({
        queryKey: ['serviceTypesTable'],
      });
      queryClient.removeQueries({ queryKey: ['serviceTypes', serviceTypeId] });
    },
  });
}
