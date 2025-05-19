'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { ServiceTypeDataType } from '@/data/service-types-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useCreateServiceTypes() {
  const session = useSession();

  const createServiceTypes = async (
    serviceTypesData: ServiceTypeDataType
  ): Promise<ServiceTypeDataType> => {
    if (!session) throw new Error('Session not found');

    let url = `${API_ROUTES.serviceTypes}`;
    const { data } = await apiClient.post(url, serviceTypesData);

    return data as Promise<ServiceTypeDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ServiceTypeDataType) => createServiceTypes(data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['serviceTypes', response.id?.toString()],
        response
      );
    },
  });
}
