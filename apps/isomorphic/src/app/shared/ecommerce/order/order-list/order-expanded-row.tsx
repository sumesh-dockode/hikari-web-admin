'use client';

import { Row } from '@tanstack/react-table';
import Image from 'next/image';
import { PiXBold } from 'react-icons/pi';
import { Flex, Text, Title } from 'rizzui';
import noImage from '@public/no-image.jpg';

export interface OrderItem {
  id: string;
  product_variant: {
    id: string;
    product: {
      id: string;
      name: string;
      slug: string;
      image?: string;
    };
    sku: string;
  };
  quantity: number;
  price: string;
  order: string;
}

export function OrderExpandedComponent<TData extends Record<string, any>>(
  row: Row<TData>
) {
  const products = row?.original?.items as OrderItem[];
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
                src={product.product_variant.product.image || noImage}
                alt={product.product_variant.product.name}
                sizes=""
              />
            </div>
            <header>
              <Title as="h4" className="mb-0.5 text-sm font-medium">
                {product.product_variant.product.name}
              </Title>
              <Text className="mb-1 text-gray-500">
                Sku: {product.product_variant.sku}
              </Text>
              <Text className="text-xs text-gray-500">
                Unit Price: {product.price}
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
            <Text className="font-medium text-gray-900 dark:text-gray-700">
              {Number(product.quantity) * Number(product.price)}
            </Text>
          </div>
        </article>
      ))}
    </div>
  );
}
