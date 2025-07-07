import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useSession } from 'next-auth/react';

export function useDeleteStorePrice() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const deleteStorePrice = async (storePriceId: string): Promise<void> => {
    if (!session) throw new Error('Session not found');
    const url = `${API_ROUTES.storePrices}${storePriceId}/`;
    await apiClient.delete(url);
  };

  return useMutation({
    mutationFn: (storePriceId: string) => deleteStorePrice(storePriceId),
    onSuccess: (_, storePriceId) => {
     
      queryClient.invalidateQueries({ queryKey: ['storePrices'] });
      
      queryClient.removeQueries({ queryKey: ['storePrices', storePriceId] });
    },
  });
}