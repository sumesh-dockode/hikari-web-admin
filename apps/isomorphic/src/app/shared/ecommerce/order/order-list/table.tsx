'use client';

import { ordersColumns } from '@/app/shared/ecommerce/order/order-list/columns';
// import { orderData } from '@/data/order-data';
import Table from '@core/components/table';
import { CustomExpandedComponent } from '@core/components/table/custom/expanded-row';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import { OrdersDataType } from '@/app/shared/ecommerce/dashboard/recent-order';
import Filters from './filters';
import { TableVariantProps } from 'rizzui';
import usePaginatedOrders from '@/hooks/orders/usePaginatedOrders';
import PageLoader from '@/app/shared/page-loader';
import { useEffect, useState } from 'react';

export default function OrderTable({
  className,
  variant = 'modern',
  hideFilters = false,
  hidePagination = false,
}: {
  className?: string;
  hideFilters?: boolean;
  hidePagination?: boolean;
  variant?: TableVariantProps;
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePaginatedOrders();

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const { table, setData } = useTanStackTable<OrdersDataType>({
    tableData: [],
    columnConfig: ordersColumns(),
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      onPaginationChange: (updater) => {
        const next =
          typeof updater === 'function'
            ? updater(table.getState().pagination)
            : updater;
        const totalFetchedPages = data?.pages?.length ?? 0;

        // if trying to go to a page that hasn't been fetched, fetch it
        if (
          next.pageIndex + 1 > totalFetchedPages &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      meta: {
        handleDeleteRow: (row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        },
      },
      enableColumnResizing: false,
    },
  });

  useEffect(() => {
    if (data) {
      const ordersAPIData =
        data?.pages?.flatMap((page: any) => page?.data?.results) || [];
      setData(ordersAPIData);
    }
  }, [data]);

  if (isLoading) return <PageLoader />;

  return (
    <div className={className}>
      {!hideFilters && <Filters table={table} />}
      <Table
        table={table}
        variant={variant}
        classNames={{
          container: 'border border-muted rounded-md border-t-0',
          rowClassName: 'last:border-0',
        }}
        components={{
          expandedComponent: CustomExpandedComponent,
        }}
      />
      {!hidePagination && <TablePagination table={table} className="py-4" />}
    </div>
  );
}
