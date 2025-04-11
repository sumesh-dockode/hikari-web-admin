'use client';

import { ordersColumns } from '@/app/shared/ecommerce/order/order-list/columns';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { TableVariantProps } from 'rizzui';
import usePaginatedOrders from '@/hooks/orders/usePaginatedOrders';
import PageLoader from '@/app/shared/page-loader';
import { useEffect, useState } from 'react';
import { OrdersDataType } from '@/data/orders';
import { OrderExpandedComponent } from './order-expanded-row';

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
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePaginatedOrders({
      page: pagination.pageIndex + 1, // API usually uses 1-based indexing
      pageSize: pagination.pageSize,
    });

  const { table, setData } = useTanStackTable<OrdersDataType>({
    tableData: [],
    columnConfig: ordersColumns(),
    options: {
      manualPagination: true, // Important for server-side pagination
      pageCount: hasNextPage
        ? pagination.pageIndex + 2
        : pagination.pageIndex + 1,
      meta: {
        handleDeleteRow: (row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        },
      },
      enableColumnResizing: false,
      onPaginationChange: (updater) => {
        const nextPagination =
          typeof updater === 'function' ? updater(pagination) : updater;

        setPagination(nextPagination);
      },
    },
    pagination,
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
          expandedComponent: OrderExpandedComponent,
        }}
      />
      {!hidePagination && (
        <TablePagination
          table={table}
          className="py-4"
          onPageChange={(pageIndex) => {
            if (pageIndex > pagination.pageIndex && hasNextPage) {
              fetchNextPage();
            }
          }}
        />
      )}
    </div>
  );
}
