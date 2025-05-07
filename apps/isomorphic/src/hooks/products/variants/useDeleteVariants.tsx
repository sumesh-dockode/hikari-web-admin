'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { CategoryDataType } from '@/data/product-categories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useDeleteVariants() {
  const { data: session } = useSession();

  const deleteVariant = async (variantId: any): Promise<void> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.variants}${variantId}/`;
    const { data } = await apiClient.delete(url);
    return data;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variantId: number) => deleteVariant(variantId),
    onSuccess: (_, variantId) => {
      queryClient.invalidateQueries({
        queryKey: ['variantsList'],
      });
      queryClient.removeQueries({ queryKey: ['variants', variantId] });
    },
  });
}
