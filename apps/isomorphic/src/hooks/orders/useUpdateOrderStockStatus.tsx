import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/app/lib/apiClient';
import { API_ROUTES } from '@/app/lib/api';

interface UpdateStockStatusPayload {
  stockId: string;
  status: string;
}

const updateStockStatusApi = async ({
  stockId,
  status,
}: UpdateStockStatusPayload): Promise<any> => {
  const url = API_ROUTES.stockStatusUpdate.replace('{id}', stockId);
  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`.replace('//', '/');

  console.log('API Request Details:', {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    endpoint: API_ROUTES.stockStatusUpdate,
    stockId,
    constructedUrl: url,
    fullUrl,
    status
  });

  try {
    const response = await apiClient.post(url, { status });
    return response.data;
  } catch (error: any) {
    console.error('API Error Details:', {
      url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config,
    });
    throw error;
  }
};

export function useUpdateOrderStockStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStockStatusApi,
    
  });
}