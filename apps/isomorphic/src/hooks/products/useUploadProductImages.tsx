'use client';

import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export interface UploadProductImagesProps {
  id?: string;
  image: string;
  alt_text?: string;
  product_variant?: string;
}
export function useUploadProductImages() {
  const session = useSession();

  const uploadProductImages = async (
    imageData: UploadProductImagesProps
  ): Promise<UploadProductImagesProps> => {
    if (!session) throw new Error('Session not found');

    let url = `${API_ROUTES.productImages}`;
    const { data } = await apiClient.post(url, imageData);

    return data?.data as Promise<UploadProductImagesProps>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UploadProductImagesProps) => uploadProductImages(data),
    onSuccess: (response) => {},
  });
}
