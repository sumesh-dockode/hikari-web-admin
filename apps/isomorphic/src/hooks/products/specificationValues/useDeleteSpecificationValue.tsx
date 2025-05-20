'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { CategoryDataType } from '@/data/product-categories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useDeleteSpecificationValue() {
  const { data: session } = useSession();

  const deleteSpecificationValue = async (
    specificationValueId: any
  ): Promise<void> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.specificationValues}${specificationValueId}/`;
    const { data } = await apiClient.delete(url);
    return data;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (specificationValueId: string) =>
      deleteSpecificationValue(specificationValueId),
    onSuccess: (_, specificationValueId) => {
      queryClient.invalidateQueries({
        queryKey: ['specificationValue'],
      });
      queryClient.removeQueries({
        queryKey: ['specifications', specificationValueId],
      });
    },
  });
}
