'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { PromotionDataType } from '@/data/promotion-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useUpdatePromotion() {
  const { data: session, status } = useSession();

  const updatePromotion = async (
    promotionData: PromotionDataType
  ): Promise<PromotionDataType> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.promotion}${promotionData.id}/`;
    const { data } = await apiClient.patch(url, promotionData);

    return data.data as Promise<PromotionDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PromotionDataType) => updatePromotion(data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['promotion', response.id?.toString()],
        response
      );
    },
  });
}
