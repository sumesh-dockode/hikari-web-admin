'use client';

import Image from 'next/image';
import Link from 'next/link';
import WidgetCard from '@core/components/cards/widget-card';
import { Button, Text } from 'rizzui';
import { routes } from '@/config/routes';
import useDashboard from '@/hooks/dashboard/useDashboard';

export default function BestSellers({ className }: { className?: string }) {
  const { data: dashboardData, isLoading } = useDashboard();
  const topProducts = dashboardData?.top_products || [];

  return (
    <WidgetCard
      title={'Top Products'}
      action={
        <Link href={routes.eCommerce.products}>
          <Button variant="text" className="whitespace-nowrap underline">
            View All
          </Button>
        </Link>
      }
      className={className}
    >
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <p>Loading top products...</p>
        </div>
      ) : (
        <div className="custom-scrollbar -me-2 mt-[18px] grid max-h-[460px] gap-4 overflow-y-auto @sm:gap-5">
          {topProducts.map((product, index) => (
            <div
              key={index}
              className="flex items-start pe-2"
            >
              <div className="relative me-3 h-11 w-11 shrink-0 overflow-hidden rounded bg-gray-100 @sm:h-12 @sm:w-12">
                <Image
                  src={product.product_image || 'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/1.webp'}
                  alt={product.product_name}
                  fill
                  sizes="(max-width: 768px) 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex w-full items-start justify-between">
                <div>
                  <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
                    {product.product_name}
                  </Text>
                  <Text className="text-gray-500">${product.product_price.toFixed(2)}</Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}
