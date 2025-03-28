"use client";

import { API_ROUTES } from "@/api";
import { CategoryDataType } from "@/data/product-categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCreateCourse() {
  const session = useSession();


  const createCategory = async (
    categoryData: CategoryDataType,
  ): Promise<CategoryDataType> => {
    if (!session) throw new Error("Session not found");

    const url = `${API_ROUTES}api/v1/admin/courses/`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${session.data?.user?.accessToken}`,
      },
      body: JSON.stringify(categoryData),
    });

    if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }

    let data = await res.json();
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
