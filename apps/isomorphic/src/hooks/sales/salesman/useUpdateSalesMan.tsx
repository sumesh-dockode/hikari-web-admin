'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { SalesmanDataType } from '@/data/salesman-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useUpdateSalesMan() {
  const { data: session, status } = useSession();

  const updateSalesMan = async (
    salesManData: SalesmanDataType
  ): Promise<SalesmanDataType> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.salesman}${salesManData.id}/`;
    const { data } = await apiClient.patch(url, salesManData);

    return data.data as Promise<SalesmanDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SalesmanDataType) => updateSalesMan(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['salesman', response.id?.toString()], response);
    },
  });
}
