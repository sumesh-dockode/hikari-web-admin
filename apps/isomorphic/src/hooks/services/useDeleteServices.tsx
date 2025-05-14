"use client";
import { API_ROUTES } from "@/app/lib/api";
import apiClient from "@/app/lib/apiClient";
import { CategoryDataType } from "@/data/product-categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useDeleteServices() {
  const { data: session } = useSession();

  const deleteServices = async (serviceId: any): Promise<void> => {


    if (!session) throw new Error("Session not found");
    let url = `${API_ROUTES.services}${serviceId}`;
      const { data } = await apiClient.delete(url);
    return data;
  };


  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceId: number) => deleteServices(serviceId),
    onSuccess: (_, serviceId) => {
      queryClient.invalidateQueries({
        queryKey: ["servicesTable"],
      });
      queryClient.removeQueries({ queryKey: ["services", serviceId] });
    },
  });
}
