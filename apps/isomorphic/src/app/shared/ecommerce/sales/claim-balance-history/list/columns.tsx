'use client';

import DeletePopover from '@core/components/delete-popover';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Flex, Text } from 'rizzui';
import { ClaimBalanceHistoryDataType } from './table';

const columnHelper = createColumnHelper<ClaimBalanceHistoryDataType>();

export const ClaimBalanceHistoryColumns = [
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
  columnHelper.accessor('claimed_by', {
    id: 'claimed_by',
    size: 300,
    header: 'Claimed By',
    cell: ({ row }) => (
      <Text className="text-sm">{row.original.claimed_by}</Text>
    ),
  }),
  columnHelper.accessor('amount', {
    id: 'amount',
    size: 150,
    header: 'Claimed Amount',
    cell: ({ row }) => (
      <Text className="font-medium text-gray-700">${row.original.amount}</Text>
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
          title={`Delete the history`}
          description={`Are you sure you want to delete this #${row.original.id} history?`}
          onDelete={() =>
            meta?.handleDeleteRow && meta?.handleDeleteRow(row.original)
          }
        />
      </Flex>
    ),
  }),
];
