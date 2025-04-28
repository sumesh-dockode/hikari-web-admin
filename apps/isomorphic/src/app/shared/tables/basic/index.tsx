'use client';

import Table from '@core/components/table';
import { orderData } from '@/data/order-data';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { basicColumns } from './column';
import { TableVariantProps } from 'rizzui';
import { OrdersDataType } from '@/data/orders';

export default function BasicTable({
  stickyHeader = false,
  variants = 'classic',
}: {
  stickyHeader?: boolean;
  variants?: TableVariantProps;
}) {
  const { table, setData } = useTanStackTable<OrdersDataType>({
    tableData: [],
    columnConfig: basicColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: stickyHeader ? orderData.length : 7,
        },
      },
      meta: {
        handleDeleteRow: (row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        },
      },
      enableColumnResizing: false,
    },
  });

  return <Table table={table} stickyHeader={stickyHeader} variant={variants} />;
}
