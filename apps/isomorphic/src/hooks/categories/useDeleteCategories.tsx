"use client";
import { API_ROUTES } from "@/app/lib/api";
import apiClient from "@/app/lib/apiClient";
import { CategoryDataType } from "@/data/product-categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useDeleteCategory() {
  const { data: session } = useSession();

  const deleteCategory = async (categoryId: any): Promise<void> => {


    if (!session) throw new Error("Session not found");
    let url = `${API_ROUTES.categories}${categoryId}`;
      const { data } = await apiClient.delete(url);
    return data;
  };


  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    onSuccess: (_, categoryId) => {
      queryClient.invalidateQueries({
        queryKey: ["categoriesTable"],
      });
      queryClient.removeQueries({ queryKey: ["categories", categoryId] });
    },
  });
}
