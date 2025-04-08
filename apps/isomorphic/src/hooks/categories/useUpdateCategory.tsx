'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { CategoryDataType } from '@/data/product-categories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useUpdateCategory() {
  const { data: session, status } = useSession();

  const updateCategory = async (
    categoryData: CategoryDataType
  ): Promise<CategoryDataType> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.categories}${categoryData.id}`;
    const { data } = await apiClient.patch(url, categoryData);

    console.log('data', data);

    return data.data as Promise<CategoryDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryDataType) => updateCategory(data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['categories', response.id?.toString()],
        response
      );
    },
  });
}
