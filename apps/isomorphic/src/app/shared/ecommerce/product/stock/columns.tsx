'use client';

import DeletePopover from '@core/components/delete-popover';
import { routes } from '@/config/routes';
import { ProductType } from './products-data';
import PencilIcon from '@core/components/icons/pencil';
import { CircleArrowRight } from 'lucide-react';

// import AvatarCard from '@core/ui/avatar-card';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import { ActionIcon, Checkbox, Flex, Text, Tooltip } from 'rizzui';
import AvatarCard from '@core/ui/avatar-card';
import { toCurrency } from '@core/utils/to-currency';
import ConfirmationPopover from '@core/components/confirmation-popover';
import { PiCheckBold } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import { Button } from 'rizzui';
import DateCell from '@core/ui/date-cell';
// import router from 'next/navigation';

const columnHelper = createColumnHelper<ProductType>();

export const productsListColumns = [
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
    id: 'sku',
    size: 150,
    header: 'Sku',
    cell: ({ row }) => <Text className="text-sm">{row.original.sku}</Text>,
  }),

  columnHelper.accessor('count', {
    id: 'count',
    size: 150,
    header: 'price',
    cell: ({ row }) => (
      <Text className="font-medium text-gray-700">
        {toCurrency(row.original.price || 0)}
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
        <Tooltip
          size="sm"
          content={'Edit Product'}
          placement="top"
          color="invert"
        >
          <ActionIcon
            size="sm"
            variant="outline"
            aria-label="Edit Product"
            onClick={() => meta?.handleEditRow?.(row.original)}
          >
            <PencilIcon className="h-4 w-4" />
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
