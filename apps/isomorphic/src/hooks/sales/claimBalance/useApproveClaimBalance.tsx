'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { ClaimBalanceHistoryDataType } from '@/app/shared/ecommerce/sales/claim-balance-history/list/table';

export function useApproveClaimBalance() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const approveClaimBalance = async (claimId: string): Promise<void> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.redeemApprove}${claimId}/approve/`;
    const { data } = await apiClient.post(url, {});
    return data;
  };

  return useMutation({
    mutationFn: (claimId: string) => approveClaimBalance(claimId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claimBalanceHistory'] });
      toast.success('Claim approved successfully');
    },
  });
}