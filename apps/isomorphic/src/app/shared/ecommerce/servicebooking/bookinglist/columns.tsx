'use client';

import DeletePopover from '@core/components/delete-popover';
import { routes } from '@/config/routes';
import PencilIcon from '@core/components/icons/pencil';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { ActionIcon, Badge, Checkbox, Text, Title, Tooltip } from 'rizzui';
import noImage from '@public/no-image.jpg';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import EyeIcon from '@core/components/icons/eye';
import { serviceDataType } from '@/data/service-data';

const columnHelper = createColumnHelper<serviceDataType>();

export const servicebookingColumn = [
  columnHelper.display({
    id: 'id',
    size: 120,
    header: 'Id',
    cell: ({ row }) => <>#{row.original.id}</>,
  }),
  // columnHelper.display({
  //   id: 'checked',
  //   size: 50,
  //   cell: ({ row }) => (
  //     <Checkbox
  //       aria-label="Select row"
  //       className="ps-3.5"
  //       checked={row.getIsSelected()}
  //       onChange={row.getToggleSelectedHandler()}
  //     />
  //   ),
  // }),
  columnHelper.display({
    id: 'image',
    size: 100,
    header: 'Image',
    cell: ({ row }) => (
      <figure className="relative aspect-square w-12 overflow-hidden rounded-lg bg-gray-100">
        <Image
          alt={row.original.service_type}
          src={row.original.image || noImage}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-cover"
        />
      </figure>
    ),
  }),

  columnHelper.display({
    id: 'user_id',
    size: 120,
    header: 'User Id',
    cell: ({ row }) => <div className="ps-6">{row.original.user_id}</div>,
  }),
  columnHelper.display({
    id: 'service_to',
    size: 120,
    header: 'Service to',
    cell: ({ row }) => <div className="ps-6">{row.original.service_to}</div>,
  }),
  columnHelper.display({
    id: 'service_type',
    size: 250,
    header: 'Service Type',
    cell: ({ row }) => (
      <Text className="truncate !text-sm">{row.original.service_type}</Text>
    ),
  }),
  // columnHelper.display({
  //   id: 'description',
  //   size: 300,
  //   header: 'Description',
  //   cell: ({ row }) => (
  //     <Text className="truncate !text-sm">{row.original.description}</Text>
  //   ),
  // }),
  columnHelper.display({
    id: 'price',
    size: 120,
    header: 'Price',
    cell: ({ row }) => <div className="ps-6">{row.original.price}</div>,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    size: 140,
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => getStatusBadge(row.original.status),
  }),

  columnHelper.display({
    id: 'action',
    size: 100,
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <Link href={routes.eCommerce.serviceDetails(row.original.id)}>
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            aria-label={'View Service'}
          >
            <EyeIcon className="h-4 w-4" />
          </ActionIcon>
        </Link>

        <DeletePopover
          title={`Delete the category`}
          description={`Are you sure you want to delete this #${row.original.id} service?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
        />
      </div>
    ),
  }),
];
