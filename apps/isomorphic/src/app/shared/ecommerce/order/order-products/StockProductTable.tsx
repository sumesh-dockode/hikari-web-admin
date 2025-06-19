'use client';

import Image from 'next/image';
import Table, { HeaderCell } from '@core/components/legacy-table';
import { Text, Title } from 'rizzui';
import { toCurrency } from '@core/utils/to-currency';
import noImage from '@public/no-image.jpg';

interface StockProduct {
  id: string;
  product_name: string;
  variant_sku: string;
  product_image: string;
  stock_status: string;
  is_next_day_shipping_available: boolean;
  price: string;
}

const columns = [
  {
    title: <HeaderCell title="Product" />,
    dataIndex: 'product_name',
    key: 'product_name',
    width: 250,
    render: (_: any, row: StockProduct) => (
      <div className="flex items-center">
        <div className="relative aspect-square w-12 overflow-hidden rounded-lg">
          <Image
            alt={row.product_name}
            src={row.product_image || noImage}
            fill
            sizes="(max-width: 768px) 100vw"
            className="object-cover"
          />
        </div>
        <div className="ms-4">
          <Title as="h6" className="!text-sm font-medium">
            {row.product_name}
          </Title>
        </div>
      </div>
    ),
  },
  {
    title: <HeaderCell title="SKU" />,
    dataIndex: 'variant_sku',
    key: 'variant_sku',
    width: 150,
    render: (sku: string) => <Text className="text-sm">{sku}</Text>,
  },
  {
    title: <HeaderCell title="Stock Status" />,
    dataIndex: 'stock_status',
    key: 'stock_status',
    width: 150,
    render: (status: string) => <Text className="text-sm">{status}</Text>,
  },
  {
    title: <HeaderCell title="Price" align="right" />,
    dataIndex: 'price',
    key: 'price',
    width: 150,
    render: (price: string) => (
      <Text className="text-end text-sm">{toCurrency(price)}</Text>
    ),
  },
];

export default function StockProductTable({ data }: { data: StockProduct[] }) {
  return (
    <div className="mt-10">
      <Title as="h4" className="mb-4 text-base font-semibold">
        Stock Products
      </Title>
      <Table
        data={data}
        // @ts-ignore
        columns={columns}
        className="text-sm"
        variant="minimal"
        rowKey={(record) => record.id}
        scroll={{ x: 800 }}
      />
    </div>
  );
}
