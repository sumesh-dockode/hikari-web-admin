import { useQuery } from '@tanstack/react-query';
import apiClient from '@/app/lib/apiClient';

export function useStorePricesByVariant(variantId?: string) {
  return useQuery({
    queryKey: ['storePrices', variantId],
    queryFn: async () => {
      if (!variantId) return [];
      const { data } = await apiClient.get(
        `/mingler/admin/store-prices/variants/${variantId}/`
      );
      return data?.data || [];
    },
    enabled: !!variantId,
  });
}