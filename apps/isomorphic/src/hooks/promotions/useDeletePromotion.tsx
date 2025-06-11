'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useDeletePromotion() {
  const { data: session } = useSession();

  const deletePromotion = async (promotionId: any): Promise<void> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.promotion}${promotionId}/`;
    const { data } = await apiClient.delete(url);
    return data;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (promotionId: number) => deletePromotion(promotionId),
    onSuccess: (_, promotionId) => {
      queryClient.invalidateQueries({
        queryKey: ['promotionTable'],
      });
      queryClient.removeQueries({ queryKey: ['promotion', promotionId] });
    },
  });
}
