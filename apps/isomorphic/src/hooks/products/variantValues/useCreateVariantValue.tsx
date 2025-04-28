"use client";

import { API_ROUTES } from '@/app/lib/api';
import apiClient from "@/app/lib/apiClient";
import { variantDataType, variantValuesDataType } from "@/data/products-data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCreateVariantsValues() {
  const session = useSession();


  const createVariantsValues = async (
    variantsValueData: variantValuesDataType,
  ): Promise<variantValuesDataType> => {
    if (!session) throw new Error("Session not found");

    console.log("variantData----", variantsValueData);
    
     let url = `${API_ROUTES.variantValues}`;
      const { data } = await apiClient.post(url, variantsValueData);

    return data as Promise<variantValuesDataType>;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: variantValuesDataType) => createVariantsValues(data),
    onSuccess: (response) => {
      queryClient.setQueryData(["variantsvalue", response.id?.toString()], response);
    },
  });
}
