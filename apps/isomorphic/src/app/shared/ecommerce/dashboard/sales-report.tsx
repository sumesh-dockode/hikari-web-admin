'use client';

import { useState } from 'react';
import WidgetCard from '@core/components/cards/widget-card';
import { CustomTooltip } from '@core/components/charts/custom-tooltip';
import { useMedia } from '@core/hooks/use-media';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from 'rizzui';
import useDashboard from '@/hooks/dashboard/useDashboard';

export default function SalesReport({ className }: { className?: string }) {
  const isTablet = useMedia('(max-width: 820px)', false);
  const { data: dashboardData, isLoading } = useDashboard();
  
  // Transform API data for the chart
  const chartData = dashboardData?.monthly_sales?.map(item => ({
    month: item.month,
    sales: item.sales,
  })) || [];

  // Format Y-axis values with dollar sign and compact format
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  return (
    <WidgetCard
      title={'Sales Report'}
      description={
        <>
          <Badge renderAsDot className="me-0.5 bg-[#282ECA]" /> Sales
        </>
      }
      descriptionClassName="text-gray-500 mt-1.5"
      className={className}
    >
      {isLoading ? (
        <div className="flex h-80 items-center justify-center">
          <p>Loading sales data...</p>
        </div>
      ) : (
        <div className='custom-scrollbar overflow-x-auto scroll-smooth'>
          <div className="h-96 w-full pt-9">
            <ResponsiveContainer
              width="100%"
              height="100%"
              {...(isTablet && { minWidth: '700px' })}
            >
              <ComposedChart
                data={chartData}
                barSize={isTablet ? 20 : 24}
                margin={{ top: 20 }}
                className="[&_.recharts-tooltip-cursor]:fill-opacity-20 dark:[&_.recharts-tooltip-cursor]:fill-opacity-10 [&_.recharts-cartesian-axis-tick-value]:fill-gray-500 [&_.recharts-cartesian-axis.yAxis]:-translate-y-3 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-vertical]:opacity-0"
              >
                <CartesianGrid strokeDasharray="8 10" strokeOpacity={0.435} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatYAxis}
                  domain={['dataMin', 'dataMax + 10000']}
                  allowDataOverflow={false}
                  tickCount={6}
                />
                <Tooltip
                  content={<CustomTooltip formattedNumber prefix="$" />}
                />
                <Bar
                  dataKey="sales"
                  fill="#282ECA"
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
