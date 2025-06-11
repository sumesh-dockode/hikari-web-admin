'use client';

import DeletePopover from '@core/components/delete-popover';
import { routes } from '@/config/routes';
import PencilIcon from '@core/components/icons/pencil';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { ActionIcon, Badge, Checkbox, Text, Title, Tooltip } from 'rizzui';
import { SalesmanDataType } from '@/data/salesman-data';
import DateCell from '@core/ui/date-cell';
import { BsStarFill } from 'react-icons/bs';
import { SuggestionsDataType } from '@/data/suggestions-data';

const columnHelper = createColumnHelper<SuggestionsDataType>();

export const suggestionColumns = [
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
  columnHelper.accessor('created_at', {
    id: 'created_at',
    size: 150,
    header: 'Created At',
    cell: ({ row }) => <DateCell date={new Date(row.original.created_at)} />,
  }),
  // columnHelper.accessor('updated_at', {
  //   id: 'updated_at',
  //   size: 200,
  //   header: 'Updated At',
  //   cell: ({ row }) => <DateCell date={new Date(row.original.updated_at)} />,
  // }),
  columnHelper.display({
    id: 'review',
    size: 300,
    header: 'Review',
    cell: ({ row }) => (
      <Text className="line-clamp-3 text-sm">{row.original.review}</Text>
    ),
  }),
  // columnHelper.display({
  //   id: 'rating',
  //   size: 100,
  //   header: 'Rating',
  //   cell: ({ row }) => (
  //     <div className="flex items-center">
  //       {row.original.rating} <BsStarFill className="h-5 w-5 ps-2" />
  //     </div>
  //   ),
  // }),
  columnHelper.display({
    id: 'user.first_name',
    size: 150,
    header: 'User',
    cell: ({ row }) => (
      <>
        <Text className="font-medium text-gray-700">
          {row.original.user?.first_name || ''}&nbsp;
          {row.original.user?.last_name || ''}
        </Text>
        <Text className="line-clamp-2 text-[13px] text-gray-500">
          {row.original.user?.email}
        </Text>
      </>
    ),
  }),

  // columnHelper.display({
  //   id: 'action',
  //   size: 100,
  //   cell: ({
  //     row,
  //     table: {
  //       options: { meta },
  //     },
  //   }) => (
  //     <div className="flex items-center justify-end gap-3 pe-4">
  //       <Tooltip content={'Edit Salesman'} placement="top" color="invert">
  //         <Link href={routes.eCommerce.editSalesMan(row.original.id as string)}>
  //           <ActionIcon size="sm" variant="outline">
  //             <PencilIcon className="h-4 w-4" />
  //           </ActionIcon>
  //         </Link>
  //       </Tooltip>
  //       <DeletePopover
  //         title={`Delete the Salesman`}
  //         description={`Are you sure you want to delete this #${row.original.username} salesman?`}
  //         onDelete={() => meta?.handleDeleteRow?.(row.original)}
  //         isLoading={meta?.deleteId === row.original.id && meta?.isDeleting}
  //       />
  //     </div>
  //   ),
  // }),
];
