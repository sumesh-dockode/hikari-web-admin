"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function usePaginatedCategories() {
  const { data: session,status } = useSession(); 

  const fetchCategories = async (pageParam: number = 1) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/admin/category/?page=${pageParam}`;

    try {
      const res = await fetch(url, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await res.json();
      console.log("Fetched Categories:", data);
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return useInfiniteQuery({
    queryKey: ["categories"],
    queryFn: ({ pageParam = 1 }) => fetchCategories(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      // let last = lastPage ? (lastPage as any).next : null;
      return lastPage ? lastPageParam + 1 : null;
      // return lastPage.next ? lastPageParam + 1 : null;
    },
    enabled: status === "authenticated"
  });
}
