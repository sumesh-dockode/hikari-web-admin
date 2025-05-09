'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { CategoryDataType } from '@/data/product-categories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useDeleteSpecification() {
  const { data: session } = useSession();

  const deleteSpecification = async (specificationId: any): Promise<void> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.specifications}${specificationId}/`;
    const { data } = await apiClient.delete(url);
    return data;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (specificationId: number) =>
      deleteSpecification(specificationId),
    onSuccess: (_, specificationId) => {
      queryClient.invalidateQueries({
        queryKey: ['specificationsList'],
      });
      queryClient.removeQueries({
        queryKey: ['specifications', specificationId],
      });
    },
  });
}
