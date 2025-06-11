'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Title } from 'rizzui';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group';
import { routes } from '@/config/routes';
import { PromotionDataType } from '@/data/promotion-data';

const columnHelper = createColumnHelper<PromotionDataType>();

export const PromotionColumn = [
  // columnHelper.display({
  //   id: 'id',
  //   size: 120,
  //   header: 'Id',
  //   cell: ({ row }) => <>#{row.original.id}</>,
  // }),
  columnHelper.accessor('store_manager', {
    id: 'store_manager',
    size: 200,
    header: 'Requested By',
    cell: ({ getValue }) => (
      <Title as="h6" className="!text-sm font-medium">
        {getValue()}
      </Title>
    ),
  }),
  columnHelper.accessor('product_name', {
    id: 'product_name',
    size: 200,
    header: 'Product Name',
    cell: ({ getValue }) => (
      <Title as="h6" className="line-clamp-2 !text-sm font-medium">
        {getValue()}
      </Title>
    ),
  }),

  columnHelper.display({
    id: 'promotion_medium',
    size: 120,
    header: 'Promotion Medium',
    cell: ({ row }) => <div className="">{row.original.promotion_medium}</div>,
  }),
  columnHelper.display({
    id: 'comments',
    size: 120,
    header: 'Comments',
    cell: ({ row }) => <div className="">{row.original.comments}</div>,
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
        deletePopoverTitle={`Delete the Promotion`}
        deletePopoverDescription={`Are you sure you want to delete this #${row.original.id} promotion?`}
        onDelete={() => meta?.handleDeleteRow?.(row.original)}
        isLoading={meta?.deleteId === row.original.id && meta?.isDeleting}
      />
    ),
  }),
];
