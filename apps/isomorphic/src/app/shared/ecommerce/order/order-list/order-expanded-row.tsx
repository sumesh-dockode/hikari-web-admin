'use client';

import { Row } from '@tanstack/react-table';
import Image from 'next/image';
import { PiXBold } from 'react-icons/pi';
import { Flex, Text, Title } from 'rizzui';
import noImage from '@public/no-image.jpg';
import { toCurrency } from '@core/utils/to-currency';

export interface OrderItem {
  id: string;
  product_variant: {
    id: string;
    product: {
      id: string;
      name: string;
      slug: string;
    };
    sku: string;
    images?: {
      id: string;
      image: string;
      alt_text: string;
      product_variant: string;
    }[];
  };
  quantity: number;
  price: string;
  order: string;
}

export function OrderExpandedComponent<TData extends Record<string, any>>(
  row: Row<TData>
) {
  const products = row?.original?.items as OrderItem[];
  const isShowQRDownload = ['Confirmed', 'Shipped', 'Delivered'].includes(
    row?.original?.status
  );

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <Flex align="center" justify="center">
        <Text className="p-4 text-2xl text-gray-500">
          No products available for this order.
        </Text>
      </Flex>
    );
  }
  return (
    <div className="grid grid-cols-1 divide-y bg-gray-0 px-[26px] py-4 dark:bg-gray-50">
      {products.map((product: OrderItem) => (
        <article
          key={product.id + product.product_variant.product.name}
          className="flex items-center justify-between py-6 first-of-type:pt-2.5 last-of-type:pb-2.5"
        >
          <div className="flex items-start">
            <div className="relative me-4 aspect-[80/60] w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
              <Image
                fill
                className="object-cover"
                src={
                  product.product_variant.images &&
                  product.product_variant.images.length > 0
                    ? product.product_variant.images[0]?.image
                    : noImage
                }
                alt={product.product_variant.product.name}
                sizes=""
              />
            </div>
            <header>
              <Title as="h4" className="mb-0.5 text-sm font-medium">
                {product.product_variant.product.name}
              </Title>
              <Text className="text-xs text-gray-500">
                Sku: {product.product_variant.sku}
              </Text>
              <Text className="text-xs text-gray-500">
                Unit Price: {toCurrency(product.price || 0)}
              </Text>
            </header>
          </div>
          <div className="flex w-full max-w-xs items-center justify-between gap-4">
            <div className="flex items-center">
              <PiXBold size={13} className="me-1 text-gray-500" />{' '}
              <Text
                as="span"
                className="font-medium text-gray-900 dark:text-gray-700"
              >
                {product.quantity}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Text className="font-medium text-gray-900 dark:text-gray-700">
                {toCurrency(Number(product.quantity) * Number(product.price))}
              </Text>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
