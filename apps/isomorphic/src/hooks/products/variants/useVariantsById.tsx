"use client";
import { API_ROUTES } from "@/app/lib/api";
import apiClient from "@/app/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useVariantsById(variantId: any) {
  const {  status } = useSession();
  const fetchVariants = async () => {
    let url = `${API_ROUTES.variants}${variantId}`;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ["variants", variantId],
    queryFn: () =>
      fetchVariants(),
    enabled: !!variantId && status === "authenticated",
  });
}  