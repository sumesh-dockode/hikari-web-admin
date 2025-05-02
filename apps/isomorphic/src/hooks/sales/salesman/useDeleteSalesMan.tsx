'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { CategoryDataType } from '@/data/product-categories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useDeleteSalesMan() {
  const { data: session } = useSession();

  const deleteSalesMan = async (salesManId: any): Promise<void> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.categories}${salesManId}`;
    const { data } = await apiClient.delete(url);
    return data;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (salesManId: number) => deleteSalesMan(salesManId),
    onSuccess: (_, salesManId) => {
      queryClient.invalidateQueries({
        queryKey: ['salesManTable'],
      });
      queryClient.removeQueries({ queryKey: ['salesman', salesManId] });
    },
  });
}
