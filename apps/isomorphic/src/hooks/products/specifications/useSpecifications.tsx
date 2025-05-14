'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

export default function useSpecifications() {
  const { status } = useSession();

  const fetchSpecifications = async () => {
    const { data } = await apiClient.get(API_ROUTES.specifications);
    return data;
  };

  return useQuery({
    queryKey: ['specificationsList'],
    queryFn: fetchSpecifications,
    enabled: status === 'authenticated',
  });
}
