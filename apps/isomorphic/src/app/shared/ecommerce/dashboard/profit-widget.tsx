'use client';

import { Button, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import WidgetCard from '@core/components/cards/widget-card';
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import { CustomTooltip } from '@core/components/charts/custom-tooltip';
import { PiInfoFill } from 'react-icons/pi';
import useDashboard from '@/hooks/dashboard/useDashboard';

export default function ProfitWidget({ className }: { className?: string }) {
  const { data: dashboardData, isLoading } = useDashboard();
  const monthlyServices = dashboardData?.monthly_services || [];
  const totalServices = dashboardData?.services_count || 0;

  return (
    <WidgetCard
      title={'Total Services'}
      description={isLoading ? 'Loading...' : `${totalServices}`}
      titleClassName="text-gray-500 font-normal font-inter !text-sm"
      descriptionClassName="text-lg font-semibold sm:text-xl 3xl:text-2xl text-gray-900 font-lexend mt-1"
      // action={
      //   <Button variant="outline" size="sm" className="text-sm">
      //     Details
      //   </Button>
      // }
      headerClassName="mb-6"
      className={cn('flex flex-col', className)}
    >
      <div className="grid flex-grow grid-cols-1 gap-3">
        {/* Filter section commented out as API doesn't support filtering */}
        <div className="mt-auto h-64 w-full pb-5 @sm:h-72 @sm:pt-3 @7xl:h-[240px] lg:pb-7">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p>Loading services data...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyServices}
                margin={{
                  top: 6,
                  bottom: 30,
                }}
              >
                {/* <defs>
                  <linearGradient id="serviceCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.125} />
                    <stop offset="95%" stopColor="#ffdadf" stopOpacity={0.05} />
                  </linearGradient>
                </defs> */}
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={false}  
                  domain={[0, 'dataMax']}
                />
                <CartesianGrid
                  strokeDasharray="8 10"
                  strokeOpacity={0.5}
                  vertical={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Services"
                  stroke="#10b981"
                  strokeWidth={2.3}
                  fillOpacity={1}
                  fill="url(#serviceCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
          <Text className="text-gray-500 @sm:mt-2.5">
            <PiInfoFill className="inline-flex h-auto w-4 text-gray-500/80 dark:text-gray-600" />{' '}
            Monthly service count statistics.
          </Text>
        </div>
      </div>
    </WidgetCard>
  );
}
