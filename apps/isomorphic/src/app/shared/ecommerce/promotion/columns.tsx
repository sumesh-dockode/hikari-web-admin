'use client';

import DeletePopover from '@core/components/delete-popover';
import { createColumnHelper } from '@tanstack/react-table';
import { Title } from 'rizzui';
import { PromotionDataType } from './table';

const columnHelper = createColumnHelper<PromotionDataType>();

export const PromotionColumn = [
  columnHelper.accessor('productname', {
    id: 'productname',
    size: 200,
    header: 'Product Name',
    cell: ({ getValue }) => (
      <Title as="h6" className="!text-sm font-medium">
        {getValue()}
      </Title>
    ),
  }),

  columnHelper.display({
    id: 'promotionmedium',
    size: 120,
    header: 'Promotion Medium',
    cell: ({ row }) => (
      <div className="ps-6">{row.original.promotionmedium}</div>
    ),
  }),
  columnHelper.display({
    id: 'comments',
    size: 120,
    header: 'Comments',
    cell: ({ row }) => <div className="ps-6">{row.original.comments}</div>,
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
        <DeletePopover
          title={`Delete the category`}
          description={`Are you sure you want to delete this #${row.original.id} category?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
        />
      </div>
    ),
  }),
];
