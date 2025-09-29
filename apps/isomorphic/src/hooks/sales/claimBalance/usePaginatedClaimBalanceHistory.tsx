'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export default function usePaginatedClaimBalanceHistory(options: {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
}) {
  const { status } = useSession();


const fetchClaimBalanceHistory = async () => {
  let url = API_ROUTES.redeemHistory;
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
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  const { data } = await apiClient.get(url);

  const results = data?.data?.results || [];

return {
  data: results.map((item: any) => {
    return {
      id: item.id,
      claimed_by: item.full_name,
      date: item.created_at?.split('T')[0],
      amount: item.requested_amount,
      status: item.redeem_status?.toLowerCase(),
      redeem_info: item.redeem_info, 
      balance: item.balance || '0.00', 
    };
  }),
  count: data?.data?.count || 0,
  total_pages: data?.data?.total_pages || 1,
};
};

return useQuery({
  queryKey: ['claimBalanceHistory', options],
  queryFn: fetchClaimBalanceHistory,
  enabled: status === 'authenticated',
});
}