'use client';

import DeletePopover from '@core/components/delete-popover';
import AvatarCard from '@core/ui/avatar-card';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Flex, Text } from 'rizzui';
import { SalesHistoryDataType } from './table';

const columnHelper = createColumnHelper<SalesHistoryDataType>();

export const SalesHistoryColumns = [
  columnHelper.display({
    id: 'select',
    size: 50,
    header: ({ table }) => (
      <Checkbox
        className="ps-3.5"
        aria-label="Select all rows"
        checked={table.getIsAllPageRowsSelected()}
        onChange={() => table.toggleAllPageRowsSelected()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="ps-3.5"
        aria-label="Select row"
        checked={row.getIsSelected()}
        onChange={() => row.toggleSelected()}
      />
    ),
  }),
  columnHelper.accessor('date', {
    id: 'date',
    size: 200,
    header: 'Date',
    cell: ({ row }) => <Text className="text-sm">{row.original.date}</Text>,
  }),
  columnHelper.accessor('name', {
    id: 'name',
    size: 300,
    header: 'Product',
    enableSorting: false,
    cell: ({ row }) => (
      <AvatarCard
        src={row.original.image}
        name={row.original.name}
        avatarProps={{
          name: row.original.name,
          size: 'lg',
          className: 'rounded-lg',
        }}
      />
    ),
  }),
  columnHelper.display({
    id: 'invoice_number',
    size: 150,
    header: 'Inovoice No',
    cell: ({ row }) => (
      <Text className="text-sm">{row.original.invoice_number}</Text>
    ),
  }),
  columnHelper.display({
    id: 'to',
    size: 200,
    header: 'To',
    cell: ({ row }) => <Text className="text-sm">{row.original.to}</Text>,
  }),
  columnHelper.display({
    id: 'from',
    size: 200,
    header: 'From',
    cell: ({ row }) => <Text className="text-sm">{row.original.from}</Text>,
  }),
  columnHelper.accessor('price', {
    id: 'price',
    size: 150,
    header: 'Price',
    cell: ({ row }) => (
      <Text className="font-medium text-gray-700">${row.original.price}</Text>
    ),
  }),
  columnHelper.accessor('incentive', {
    id: 'incentive',
    size: 120,
    header: 'Incentive',
    cell: ({ row }) => (
      <Text className="text-sm">{row.original.incentive}</Text>
    ),
  }),
  columnHelper.display({
    id: 'action',
    size: 120,
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => (
      <Flex align="center" justify="end" gap="3" className="pe-4">
        <DeletePopover
          title={`Delete the product`}
          description={`Are you sure you want to delete this #${row.original.id} product?`}
          onDelete={() =>
            meta?.handleDeleteRow && meta?.handleDeleteRow(row.original)
          }
        />
      </Flex>
    ),
  }),
];
