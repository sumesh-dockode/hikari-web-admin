import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/app/lib/apiClient';
import { API_ROUTES } from '@/app/lib/api';

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string, [key: string]: any }) =>
      apiClient.post(API_ROUTES.assignDeliveryManager.replace('{id}', id), data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}