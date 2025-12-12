'use client';

import DeletePopover from '@core/components/delete-popover';
import { routes } from '@/config/routes';
import PencilIcon from '@core/components/icons/pencil';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import { ActionIcon, Badge, Checkbox, Text, Title, Tooltip } from 'rizzui';
import { StoreManagerTableDataType } from '@/data/store-manager-data';

const columnHelper = createColumnHelper<StoreManagerTableDataType>();

export const storeManagerColumns = [
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

  columnHelper.accessor('first_name', {
    id: 'first_name',
    size: 200,
    header: 'Name',
    cell: ({ row }) => (
      <Title as="h6" className="!text-sm font-medium">
        {row.original.first_name} {row.original?.last_name || ''}
      </Title>
    ),
  }),
  columnHelper.accessor('store_info.name', {
    id: 'store_name',
    size: 200,
    header: 'Store Name',
    cell: ({ row, getValue }) => (
      <>
        <Title as="h6" className="!text-sm font-medium">
          {getValue()}
        </Title>
        <Text className="line-clamp-2 text-[13px] text-gray-500">
          {row.original.store_info?.address}
        </Text>
      </>
    ),
  }),
  columnHelper.accessor('email', {
    id: 'email',
    size: 150,
    header: 'Email',
    cell: ({ row }) => (
      <Text className="font-medium text-gray-700">{row.original.email}</Text>
    ),
  }),
  columnHelper.display({
    id: 'phone_number',
    size: 150,
    header: 'Phone',
    cell: ({ row }) => (
      <Text className="font-medium text-gray-700">
        {row.original.phone_number}
      </Text>
    ),
  }),
  columnHelper.display({
    id: 'is_active',
    size: 150,
    header: 'Status',
    cell: ({ row }) => (
      <>
        {!row.original.is_active ? (
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-100/80 px-2.5 py-1">
            <Badge renderAsDot />
            <span className="text-xs font-semibold text-gray-900">
              Inactive
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-green-lighter px-2.5 py-1">
            <Badge renderAsDot color={'success'} />
            <span className="text-xs font-semibold text-green-dark">
              Active
            </span>
          </div>
        )}
      </>
    ),
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
        <Tooltip content={'Edit Store OMS'} placement="top" color="invert">
          <Link
            href={routes.eCommerce.editStoreManager(row.original.id as string)}
          >
            <ActionIcon size="sm" variant="outline">
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <DeletePopover
          title={`Delete the Store OMS`}
          description={`Are you sure you want to delete this #${row.original.username} store oms?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
          isLoading={meta?.deleteId === row.original.id && meta?.isDeleting}
        />
      </div>
    ),
  }),
];
