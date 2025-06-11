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
import { PaginationState } from '@tanstack/react-table';
import usePaginatedDeliveryManager from '@/hooks/DeliveryManager/usePaginatedDeliveryManager';

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
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: deliveryManagerData, isLoading: isLoadingDeliveryManager } =
    usePaginatedDeliveryManager({});
  const { data, isLoading } = usePaginatedOrders(pagination);

  const pageCount = data?.data?.total_pages || 1;

  const { table, setData } = useTanStackTable<OrdersDataType>({
    tableData: [],
    columnConfig: ordersColumns(),
    options: {
      meta: {
        handleDeleteRow: (row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        },
      },
      enableColumnResizing: false,
      manualPagination: true,
      pageCount: pageCount as number,
      onPaginationChange: (updater) => {
        const nextPagination =
          typeof updater === 'function' ? updater(pagination) : updater;

        setPagination(nextPagination);
      },
    },
    pagination,
  });

  useEffect(() => {
    if (data && deliveryManagerData) {
      const ordersAPIData =
        data?.data?.results?.map((i: OrdersDataType) => {
          const assigned_to = deliveryManagerData?.data.find(
            (deliveryManager: any) => deliveryManager.id === i.assigned_to
          );
          return {
            ...i,
            assigned_to: assigned_to
              ? `${assigned_to.first_name} ${assigned_to.last_name}`
              : null,
          };
        }) || [];
      setData(ordersAPIData);
    }
  }, [data, deliveryManagerData]);

  if (isLoading || isLoadingDeliveryManager) return <PageLoader />;

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
      {!hidePagination && <TablePagination table={table} className="py-4" />}
    </div>
  );
}
