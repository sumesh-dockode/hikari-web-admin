import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useServiceById(service_id: string) {
  const { status } = useSession();

  return useQuery({
    queryKey: ['service', service_id],
    queryFn: async () => {
      const url = API_ROUTES.singleService.replace('{service_id}', service_id);
      const { data } = await apiClient.get(url);
      return data;
    },
    enabled: status === 'authenticated' && !!service_id,
    throwOnError(error, _query) {
      throw error;
    },
  });
}

