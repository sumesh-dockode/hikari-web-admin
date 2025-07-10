'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';

// Define the dashboard data interface
export interface DashboardData {
  services_count: number;
  total_products_count: number;
  total_orders_count: number;
  total_sales_revenue: number;
  monthly_services: { month: string; count: number }[];
  monthly_sales: { month: string; sales: number }[];
  top_products: {
    product_name: string;
    product_price: number;
    product_image: string | null;
  }[];
}

export default function useDashboard() {
  const { status } = useSession();

  const fetchDashboard = async (): Promise<DashboardData> => {
    const { data } = await apiClient.get(API_ROUTES.dashboard);
    return data.data;
  };

  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    enabled: status === 'authenticated',
  });
}