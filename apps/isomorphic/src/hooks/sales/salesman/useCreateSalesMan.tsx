'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { SalesmanDataType } from '@/data/salesman-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useCreateSalesMan() {
  const session = useSession();

  const createSalesMan = async (
    salesmanData: SalesmanDataType
  ): Promise<SalesmanDataType> => {
    if (!session) throw new Error('Session not found');

    let url = `${API_ROUTES.salesman}`;
    const { data } = await apiClient.post(url, salesmanData);

    return data as Promise<SalesmanDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SalesmanDataType) => createSalesMan(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['salesman', response.id?.toString()], response);
    },
  });
}
