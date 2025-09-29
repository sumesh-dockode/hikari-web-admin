import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/app/lib/apiClient';
import { API_ROUTES } from '@/app/lib/api';
import { useSession } from 'next-auth/react';

export function useCreateStorePrice() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const createStorePrice = async ({
    variantId,
    storeId,
    price,
  }: {
    variantId: string;
    storeId: string;
    price: number;
  }) => {
    if (!session) throw new Error('Session not found');
    
    
    console.log('Creating store price with payload:', {
      variantId,
      storeId,
      price,
    });
    
 
    const url = `${API_ROUTES.storePricesByVariant}${variantId}/`;
    
    try {
     
      const payload = {
        store_id: storeId,
        price: price
      };
      
      console.log('Final API payload:', payload);
      
      const { data } = await apiClient.post(url, payload);
      return data;
    } catch (error: any) {
     
      console.error('Store price creation error:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        url,
        requestPayload: {
          store_id: storeId,
          price
        }
      });
      
      throw error;
    }
  };

  return useMutation({
    mutationFn: createStorePrice,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['storePrices', variables.variantId] });
    },
  });
}
