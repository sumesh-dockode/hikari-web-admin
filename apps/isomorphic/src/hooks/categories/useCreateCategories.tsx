"use client";

import { API_ROUTES } from '@/app/lib/api';
import apiClient from "@/app/lib/apiClient";
import { CategoryDataType } from "@/data/product-categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCreateCategories() {
  const session = useSession();


  const createCategory = async (
    categoryData: CategoryDataType,
  ): Promise<CategoryDataType> => {
    if (!session) throw new Error("Session not found");

    console.log("categoryData", categoryData);
    
     let url = `${API_ROUTES.categories}`;
      const { data } = await apiClient.post(url, categoryData);

    return data as Promise<CategoryDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryDataType) => createCategory(data),
    onSuccess: (response) => {
      queryClient.setQueryData(["categories", response.id?.toString()], response);
    },
  });
}
