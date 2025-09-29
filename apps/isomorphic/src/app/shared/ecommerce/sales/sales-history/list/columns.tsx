'use client';

import { SalesHistoryDataType } from '@/data/saleshistory-data';
import DeletePopover from '@core/components/delete-popover';
import AvatarCard from '@core/ui/avatar-card';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import { Checkbox, Flex, Text, Title } from 'rizzui';

const columnHelper = createColumnHelper<SalesHistoryDataType>();

const formatOrderId = (id: string) => {
  return id.slice(-4);
};

export const SalesHistoryColumns = [
  columnHelper.accessor('created_at', {
    id: 'created_at',
    size: 200,
    header: 'Date',
    cell: ({ row }) => <DateCell date={new Date(row.original.created_at)} />,
  }),
 columnHelper.display({
  id: 'name',
  size: 300,
  header: 'Product',
  enableSorting: false,
  cell: ({ row }) => {
    const images = row.original.product_variant.images;
    const imageUrl = Array.isArray(images) && images.length > 0 
      ? (images[0] as { image: string }).image 
      : '';
      
    return (
      <AvatarCard
        src={imageUrl}
        name={row.original.product_name}
        description={row.original.product_variant.sku}
        avatarProps={{
          name: row.original.product_name,
          size: 'lg',
          className: 'rounded-lg',
        }}
      />
    );
  },
}),
  columnHelper.display({
    id: 'order',
    size: 150,
    header: 'Order Id',
    cell: ({ row }) => (
      <Link href={`/orders/${row.original.order}`} className="hover:underline">
       {formatOrderId(row.original.order)}
      </Link>
    ),
  }),
  columnHelper.display({
    id: 'store',
    size: 200,
    header: 'Store',
    cell: ({ row }) => (
      <>
        <Title as="h6" className="!text-sm font-medium">
          {row.original.store?.name}
        </Title>
        <Text className="line-clamp-2 text-[13px] text-gray-500">
          {row.original.store?.address}
        </Text>
      </>
    ),
  }),
  columnHelper.display({
    id: 'sold_by_name',
    size: 200,
    header: 'Sold By',
    cell: ({ row }) => (
      <Text className="text-sm">{row.original.sold_by_name}</Text>
    ),
  }),
  // columnHelper.display({
  //   id: 'to',
  //   size: 200,
  //   header: 'To',
  //   cell: ({ row }) => <Text className="text-sm">{row.original.to}</Text>,
  // }),
  // columnHelper.display({
  //   id: 'from',
  //   size: 200,
  //   header: 'From',
  //   cell: ({ row }) => <Text className="text-sm">{row.original.from}</Text>,
  // }),
  // columnHelper.accessor('price', {
  //   id: 'price',
  //   size: 150,
  //   header: 'Price',
  //   cell: ({ row }) => (
  //     <Text className="font-medium text-gray-700">${row.original.price}</Text>
  //   ),
  // }),
  columnHelper.accessor('incentive_amount', {
    id: 'incentive_amount',
    size: 120,
    header: 'Incentive',
    cell: ({ row }) => (
      <Text className="text-sm">{row.original.incentive_amount}</Text>
    ),
  }),
  // columnHelper.display({
  //   id: 'action',
  //   size: 120,
  //   cell: ({
  //     row,
  //     table: {
  //       options: { meta },
  //     },
  //   }) => (
  //     <Flex align="center" justify="end" gap="3" className="pe-4">
  //       <DeletePopover
  //         title={`Delete the product`}
  //         description={`Are you sure you want to delete this #${row.original.id} product?`}
  //         onDelete={() =>
  //           meta?.handleDeleteRow && meta?.handleDeleteRow(row.original)
  //         }
  //       />
  //     </Flex>
  //   ),
  // }),
];
