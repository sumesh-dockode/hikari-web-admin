'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export default function usePaginatedSalesHistory(options: {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  sold_by?: number;
}) {
  const { status } = useSession();

  const fetchSalesHistory = async () => {
    let url = API_ROUTES.salesHistory;
    let params = [];

    if (options?.pageIndex || options?.pageIndex === 0) {
      params.push(`page=${options.pageIndex + 1}`);
    }
    if (options?.pageSize) {
      params.push(`page_size=${options.pageSize}`);
    }
    if (options?.search) {
      params.push(`search=${options.search}`);
    }
    if (options?.sold_by) {
      params.push(`sold_by=${options.sold_by}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ['salesHistoryTable', options],
    queryFn: () => fetchSalesHistory(),
    enabled: status === 'authenticated',
    throwOnError(error, query) {
      throw error;
    },
  });
}
