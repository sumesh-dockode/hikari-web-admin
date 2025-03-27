'use client';

import DeletePopover from '@core/components/delete-popover';
import { createColumnHelper } from '@tanstack/react-table';
import { Title } from 'rizzui';
import { PromotionDataType } from './table';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group';
import { routes } from '@/config/routes';

const columnHelper = createColumnHelper<PromotionDataType>();

export const PromotionColumn = [
  columnHelper.display({
    id: 'id',
    size: 120,
    header: 'Id',
    cell: ({ row }) => <>#{row.original.id}</>,
  }),
  columnHelper.accessor('requestedby', {
    id: 'requestedby',
    size: 200,
    header: 'Requested By',
    cell: ({ getValue }) => (
      <Title as="h6" className="!text-sm font-medium">
        {getValue()}
      </Title>
    ),
  }),
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
    size: 130,
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => (
      <TableRowActionGroup
        editUrl={routes.eCommerce.editPromotion(row.original.id)}
        // viewUrl={routes.eCommerce.promotionDetails(row.original.id)}
        deletePopoverTitle={`Delete the order`}
        deletePopoverDescription={`Are you sure you want to delete this #${row.original.id} order?`}
        onDelete={() => meta?.handleDeleteRow?.(row.original)}
      />
    ),
  }),
];
