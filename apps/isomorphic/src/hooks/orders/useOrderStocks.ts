import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export function useOrderStocks(orderId: string) {
    console.log("Querying stocks for order:", orderId);
  return useQuery({
    queryKey: ['order-stock-products', orderId],
    queryFn: async () => {
      const res = await apiClient.get(API_ROUTES.stocks, {
        params: { order: orderId },
      });
      return res.data.data;
    },
    enabled: !!orderId,
  });
}
