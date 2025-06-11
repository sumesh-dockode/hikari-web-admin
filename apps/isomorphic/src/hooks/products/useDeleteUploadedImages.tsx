'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useDeleteProductImages() {
  const { data: session } = useSession();

  const deleteProductImages = async (imageId: any): Promise<void> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.productImages}${imageId}/`;
    const { data } = await apiClient.delete(url);
    return data;
  };

  return useMutation({
    mutationFn: (imageId: number) => deleteProductImages(imageId),
    onSuccess: (_, imageId) => {},
  });
}
