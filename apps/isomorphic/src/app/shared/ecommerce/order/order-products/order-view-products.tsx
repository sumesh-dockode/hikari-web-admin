'use client';

import Image from 'next/image';
import Table, { HeaderCell } from '@core/components/legacy-table';
import { Title, Text } from 'rizzui';
import { toCurrency } from '@core/utils/to-currency';
import { CartItem } from '@/types';
import { OrderItem } from '../order-list/order-expanded-row';
import noImage from '@public/no-image.jpg';

const columns = [
  {
    title: <HeaderCell title="Product" />,
    dataIndex: 'product',
    key: 'product',
    width: 250,
    render: (_: any, row: OrderItem) => (
      <div className="flex items-center">
        <div className="relative aspect-square w-12 overflow-hidden rounded-lg">
          <Image
            alt={row.product_variant.product.name}
            src={
              row.product_variant.images &&
              row.product_variant.images.length > 0
                ? row.product_variant.images[0]
                : noImage
            }
            fill
            sizes="(max-width: 768px) 100vw"
            className="object-cover"
          />
        </div>
        <div className="ms-4">
          <Title as="h6" className="!text-sm font-medium">
            {row.product_variant.product.name}
          </Title>
        </div>
      </div>
    ),
  },
  {
    title: <HeaderCell title="Product Price" align="right" />,
    dataIndex: 'price',
    key: 'price',
    width: 200,
    render: (price: string) => (
      <Text className="text-end text-sm">{toCurrency(price)}</Text>
    ),
  },
  {
    title: <HeaderCell title="Quantity" align="center" />,
    dataIndex: 'quantity',
    key: 'quantity',
    width: 150,
    render: (quantity: number) => (
      <Text className="text-center text-sm font-semibold">{quantity}</Text>
    ),
  },

  {
    title: <HeaderCell title="Price" align="right" />,
    dataIndex: 'price',
    key: 'price',
    width: 200,
    render: (price: number, row: CartItem) => (
      <Text className="text-end text-sm">
        {toCurrency(price * row.quantity)}
      </Text>
    ),
  },
];

export default function OrderViewProducts({ items }: { items: OrderItem[] }) {
  return (
    <Table
      data={items}
      // @ts-ignore
      columns={columns}
      className="text-sm"
      variant="minimal"
      rowKey={(record) => record.id}
      scroll={{ x: 800 }}
    />
  );
}
