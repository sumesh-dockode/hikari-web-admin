"use client";

import { API_ROUTES } from "@/api";
import apiClient from "@/app/lib/apiClient";
import { productsData, productsDataType } from "@/data/products-data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCreateProducts() {
  const session = useSession();


  const createProducts = async (
    productData: productsDataType,
  ): Promise<productsDataType> => {
    if (!session) throw new Error("Session not found");

    console.log("productData----", productData);
    
     let url = `${API_ROUTES.products}`;
      const { data } = await apiClient.post(url, productData);

    return data as Promise<productsDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: productsDataType) => createProducts(data),
    onSuccess: (response) => {
      queryClient.setQueryData(["products", response.id?.toString()], response);
    },
  });
}
