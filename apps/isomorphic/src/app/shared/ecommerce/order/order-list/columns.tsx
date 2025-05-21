'use client';

import { downloadAllQRCodesFromStockAPI } from '@/app/lib/downloadQrCode';
// import { downloadQRCodeWithLogo } from '@/app/lib/downloadQrCode';
import { routes } from '@/config/routes';
import { OrdersDataType } from '@/data/orders';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group';
import TableAvatar from '@core/ui/avatar-card';
import DateCell from '@core/ui/date-cell';
import { toCurrency } from '@core/utils/to-currency';
import { createColumnHelper } from '@tanstack/react-table';
import { BiDownload } from 'react-icons/bi';
import { PiCaretDownBold, PiCaretUpBold } from 'react-icons/pi';
import { ActionIcon, Box, Text, Tooltip } from 'rizzui';

const columnHelper = createColumnHelper<OrdersDataType>();

export const ordersColumns = (expanded: boolean = true) => {
  // const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (orderId: string) => {
    await downloadAllQRCodesFromStockAPI({
      loaderCallbacks: {
        onStart: () => {},
        onFinish: () => {},
      },
      orderId: orderId, // replace with actual ID
    });
  };

  const columns = [
    columnHelper.display({
      id: 'id',
      size: 120,
      header: 'Order Id',
      cell: ({ row }) => <>#{row.original.id}</>,
    }),
    columnHelper.accessor('order_info', {
      id: 'order-info',
      size: 300,
      header: 'Customer',
      enableSorting: false,
      cell: ({ row }) => (
        <Box>
          <Text>{row.original.order_info?.name}</Text>
          <Text className="text-xs text-gray-400">
            {row.original.order_info?.address}
          </Text>
        </Box>
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
          {toCurrency(row.original.total_price || 0)}
        </Text>
      ),
    }),
    columnHelper.accessor('created_at', {
      id: 'created_at',
      size: 200,
      header: 'Created',
      cell: ({ row }) => <DateCell date={new Date(row.original.created_at)} />,
    }),
    columnHelper.display({
      id: 'assigned_to',
      size: 150,
      header: 'Assigned To',
      cell: ({ row }) => (
        <Text className="font-medium text-gray-700">
          {row.original.assigned_to || '-'}
        </Text>
      ),
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
      size: 130,
      cell: ({
        row,
        table: {
          options: { meta },
        },
      }) => (
        <TableRowActionGroup
          // editUrl={routes.eCommerce.editOrder(row.original.id)}
          viewUrl={routes.eCommerce.orderDetails(row.original.id)}
          deletePopoverTitle={`Delete the order`}
          deletePopoverDescription={`Are you sure you want to delete this #${row.original.id} order?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
        >
          {['Confirmed', 'Shipped', 'Delivered'].includes(
            row.original.status
          ) && (
            <Tooltip
              size="sm"
              content={'Download QR Code'}
              placement="top"
              color="invert"
            >
              <ActionIcon
                as="span"
                size="sm"
                variant="outline"
                aria-label={'Download QR Code'}
                onClick={() => handleDownload(row.original.id)}
              >
                <BiDownload className="size-4" />
              </ActionIcon>
            </Tooltip>
          )}
        </TableRowActionGroup>
      ),
    }),
  ];

  return expanded ? [expandedOrdersColumns, ...columns] : columns;
};

const expandedOrdersColumns = columnHelper.display({
  id: 'expandedHandler',
  size: 60,
  cell: ({ row }) => (
    <>
      {row.getCanExpand() && (
        <ActionIcon
          size="sm"
          rounded="full"
          aria-label="Expand row"
          className="ms-2"
          variant={row.getIsExpanded() ? 'solid' : 'outline'}
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? (
            <PiCaretUpBold className="size-3.5" />
          ) : (
            <PiCaretDownBold className="size-3.5" />
          )}
        </ActionIcon>
      )}
    </>
  ),
});
