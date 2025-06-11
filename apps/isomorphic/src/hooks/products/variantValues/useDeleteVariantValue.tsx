'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useDeleteVariantsValue() {
  const { data: session } = useSession();

  const deleteVariantValue = async (variantValueId: any): Promise<void> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.variantValues}${variantValueId}/`;
    const { data } = await apiClient.delete(url);
    return data;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variantValueId: number) => deleteVariantValue(variantValueId),
    onSuccess: (_, variantValueId) => {
      queryClient.invalidateQueries({
        queryKey: ['variantValues'],
      });
      queryClient.removeQueries({ queryKey: ['variants', variantValueId] });
    },
  });
}
