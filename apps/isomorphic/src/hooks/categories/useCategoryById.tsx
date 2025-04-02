"use client";
import { API_ROUTES } from "@/app/lib/api";
import apiClient from "@/app/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCategoryById(categoryId: any) {
  const {  status } = useSession();
  const fetchCategories = async () => {
    let url = `${API_ROUTES.categories}${categoryId}/`;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () =>
      fetchCategories(),
    enabled: !!categoryId && status === "authenticated",
  });
}  