'use client';

import DeletePopover from '@core/components/delete-popover';
import { productsDataType } from '@/data/products-data';
import PencilIcon from '@core/components/icons/pencil';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Checkbox, Flex, Text, Tooltip } from 'rizzui';
import AvatarCard from '@core/ui/avatar-card';
import { toCurrency } from '@core/utils/to-currency';
import ConfirmationPopover from '@core/components/confirmation-popover';
import { PiCheckBold, PiDownloadSimpleBold } from 'react-icons/pi';
import dayjs from 'dayjs';

const columnHelper = createColumnHelper<productsDataType>();

export const productsListColumns = [
  // columnHelper.display({
  //   id: 'select',
  //   size: 50,
  //   header: ({ table }) => (
  //     <Checkbox
  //       className="ps-3.5"
  //       aria-label="Select all rows"
  //       checked={table.getIsAllPageRowsSelected()}
  //       onChange={() => table.toggleAllPageRowsSelected()}
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       className="ps-3.5"
  //       aria-label="Select row"
  //       checked={row.getIsSelected()}
  //       onChange={() => row.toggleSelected()}
  //     />
  //   ),
  // }),

  columnHelper.accessor('name', {
    id: 'name',
    size: 300,
    header: 'Product',
    enableSorting: false,
    cell: ({ row }) => (
      <AvatarCard
        src={row.original.product_images?.[0]}
        name={row.original.name}
        description={row.original.description}
        descriptionClassName="line-clamp-2"
        avatarProps={{
          name: row.original.name,
          size: 'lg',
          className: 'rounded-lg',
        }}
      />
    ),
  }),

  columnHelper.display({
    id: 'time',
    size: 150,
    header: 'Created time',
    cell: ({ row }) => (
      <Text className="text-sm">
        {row.original.time ? dayjs(row.original.time).format('MMM D, YYYY h:mm A') : '-'}
      </Text>
    ),
  }),

  columnHelper.accessor('count', {
    id: 'count',
    size: 150,
    header: 'count',
    cell: ({ row }) => (
      <Text className="font-medium text-gray-700">
        {(row.original.count || 0)}
      </Text>
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
        

        <Tooltip size="sm" content="Download" placement="top" color="invert">
          <ActionIcon
            size="sm"
            variant="outline"
            aria-label="Download Product"
            onClick={() => meta?.handleDownloadRow?.(row.original)}
          >
            <PiDownloadSimpleBold className="h-4 w-4" />
          </ActionIcon>
        </Tooltip>

   

        <DeletePopover
          title={`Delete the product`}
          description={`Are you sure you want to delete '${row.original.name}'?`}
          onDelete={() =>
            meta?.handleDeleteRow && meta?.handleDeleteRow(row.original)
          }
        />
      </Flex>
    ),
  }),
];
