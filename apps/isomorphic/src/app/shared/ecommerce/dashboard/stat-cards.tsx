'use client';

import MetricCard from '@core/components/cards/metric-card';
import cn from '@core/utils/class-names';
import {
  PiGiftDuotone,
  PiBankDuotone,
  PiShoppingCartDuotone,
  PiToolboxDuotone,
} from 'react-icons/pi';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import useDashboard from '@/hooks/dashboard/useDashboard';

export default function StatCards({ className }: { className?: string }) {
  const { data: dashboardData, isLoading } = useDashboard();

  // Create chart data from monthly sales
  const salesData = dashboardData?.monthly_sales?.map(item => ({
    day: item.month,
    sale: item.sales,
    cost: item.sales * 0.6, // Example calculation
  })) || [];

  // Create chart data from monthly services
  const servicesData = dashboardData?.monthly_services?.map(item => ({
    day: item.month,
    sale: item.count * 100, // Scale for visualization
    cost: item.count * 50,  // Example calculation
  })) || [];

  // Create chart data from orders (using monthly sales as proxy)
  const orderData = dashboardData?.monthly_sales?.map(item => ({
    day: item.month,
    sale: item.sales / 1000, // Scale for visualization
    cost: item.sales / 2000,
  })) || [];

  const eComDashboardStatData = [
    {
      id: '1',
      icon: <PiShoppingCartDuotone className="h-6 w-6" />,
      title: 'Total Orders',
      metric: dashboardData ? dashboardData.total_orders_count.toString() : '...',
      style: 'text-[#3872FA]',
      fill: '#3872FA',
      chart: orderData,
    },
    {
      id: '2',
      icon: <PiGiftDuotone className="h-6 w-6" />,
      title: 'Total Products',
      metric: dashboardData ? dashboardData.total_products_count.toString() : '...',
      style: 'text-[#10b981]',
      fill: '#10b981',
      chart: servicesData,
    },
    {
      id: '3',
      icon: <PiBankDuotone className="h-6 w-6" />,
      title: 'Total Revenue',
      metric: dashboardData ? `$${dashboardData.total_sales_revenue.toLocaleString()}` : '...',
      style: 'text-[#7928ca]',
      fill: '#7928ca',
      chart: salesData,
    },
    {
      id: '4',
      icon: <PiToolboxDuotone className="h-6 w-6" />,
      title: 'Services Count',
      metric: dashboardData ? dashboardData.services_count.toString() : '...',
      style: 'text-[#f59e0b]',
      fill: '#f59e0b',
      chart: servicesData,
    },
  ];

  return (
    <div
      className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 3xl:gap-8 4xl:gap-9', className)}
    >
      {eComDashboardStatData.map((stat) => (
        <MetricCard
          key={stat.title + stat.id}
          title={stat.title}
          metric={stat.metric}
          metricClassName="lg:text-[22px]"
          icon={stat.icon}
          iconClassName={cn(
            '[&>svg]:w-10 [&>svg]:h-8 lg:[&>svg]:w-11 lg:[&>svg]:h-9 w-auto h-auto p-0 bg-transparent -mx-1.5',
            stat.id === '1' &&
              '[&>svg]:w-9 [&>svg]:h-7 lg:[&>svg]:w-[42px] lg:[&>svg]:h-[34px]',
            stat.style
          )}
          chart={
            <ResponsiveContainer width="100%" height="100%">
              <BarChart barSize={5} barGap={2} data={stat.chart}>
                <Bar dataKey="sale" fill={stat.fill} radius={5} />
              </BarChart>
            </ResponsiveContainer>
          }
          chartClassName="hidden @[200px]:flex @[200px]:items-center h-14 w-24"
          className="@container [&>div]:items-center"
        />
      ))}
    </div>
  );
}
