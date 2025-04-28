import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useOrderById(id: string) {
  const { status } = useSession();

  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`${API_ROUTES.singleOrder}${id}/`);
      return data;
    },
    enabled: status === 'authenticated',
  });
}
