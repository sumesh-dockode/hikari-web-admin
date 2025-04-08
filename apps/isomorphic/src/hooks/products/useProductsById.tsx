"use client";
import { API_ROUTES } from "@/app/lib/api";
import apiClient from "@/app/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useProductsById(productId: any) {
  const {  status } = useSession();
  const fetchProducts = async () => {
    let url = `${API_ROUTES.products}${productId}`;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ["products", productId],
    queryFn: () =>
      fetchProducts(),
    enabled: !!productId && status === "authenticated",
  });
}  