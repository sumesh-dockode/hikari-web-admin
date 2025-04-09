"use client";

import { API_ROUTES } from "@/api";
import apiClient from "@/app/lib/apiClient";
import { variantDataType } from "@/data/products-data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCreateVariants() {
  const session = useSession();


  const createVariants = async (
    variantData: variantDataType,
  ): Promise<variantDataType> => {
    if (!session) throw new Error("Session not found");

    console.log("variantData----", variantData);
    
     let url = `${API_ROUTES.variants}`;
      const { data } = await apiClient.post(url, variantData);

    return data as Promise<variantDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: variantDataType) => createVariants(data),
    onSuccess: (response) => {
      queryClient.setQueryData(["variants", response.id?.toString()], response);
    },
  });
}
