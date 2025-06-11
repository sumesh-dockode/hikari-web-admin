"use client";
import { API_ROUTES } from "@/app/lib/api";
import apiClient from "@/app/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useVariantsValueById(variantValueId: any) {
  const {  status } = useSession();
  const fetchVariants = async () => {
    let url = `${API_ROUTES.variantValues}${variantValueId}`;
    const { data } = await apiClient.get(url);

    return data;
  };

  return useQuery({
    queryKey: ["variantsListValues", variantValueId],
    queryFn: () =>
      fetchVariants(),
    enabled: !!variantValueId && status === "authenticated",
  });
}  