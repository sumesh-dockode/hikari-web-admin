'use client';

import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import AvatarCard from '@core/ui/avatar-card';
import DateCell from '@core/ui/date-cell';
import { toCurrency } from '@core/utils/to-currency';
import { createColumnHelper } from '@tanstack/react-table';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group';
import { OrdersDataType } from '@/data/orders';
import { Text } from 'rizzui/typography';

const columnHelper = createColumnHelper<OrdersDataType>();

export const basicColumns = [
  columnHelper.display({
    id: 'id',
    size: 120,
    header: 'Order Id',
    cell: ({ row }) => <>#{row.original.id}</>,
  }),
  columnHelper.accessor('user', {
    id: 'user',
    size: 300,
    header: 'Customer',
    enableSorting: false,
    cell: ({ row }) => (
      <Text>{row.original.user}</Text>
      // <TableAvatar
      //   src={row.original.avatar}
      //   name={row.original.name}
      //   description={row.original.email}
      // />
    ),
  }),
  columnHelper.display({
    id: 'items',
    size: 150,
    header: 'Items',
    cell: ({ row }) => (
      <Text className="font-medium text-gray-700">
        {row.original.items?.length || 0}
      </Text>
    ),
  }),
  columnHelper.accessor('total_price', {
    id: 'total_price',
    size: 150,
    header: 'Price',
    cell: ({ row }) => (
      <Text className="font-medium text-gray-700">
        {row.original.total_price}
      </Text>
    ),
  }),
  columnHelper.accessor('created_at', {
    id: 'created_at',
    size: 200,
    header: 'Created',
    cell: ({ row }) => <DateCell date={new Date(row.original.created_at)} />,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    size: 140,
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => getStatusBadge(row.original.status),
  }),
  columnHelper.display({
    id: 'actions',
    size: 150,
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => (
      <TableRowActionGroup
        onDelete={() => meta?.handleDeleteRow?.(row.original)}
      />
    ),
  }),
];
