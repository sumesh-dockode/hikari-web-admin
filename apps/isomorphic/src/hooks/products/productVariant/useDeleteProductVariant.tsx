'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useDeleteProductVariant() {
  const { data: session } = useSession();

  const deleteProductVariant = async (variantId: string): Promise<void> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.productvariants}${variantId}/`;
    const { data } = await apiClient.delete(url);
    return data;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variantId: string) => deleteProductVariant(variantId),
    onSuccess: (_, variantId) => {
      queryClient.removeQueries({ queryKey: ['productVariant', variantId] });
    },
  });
}
