'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { ServiceData } from '@/data/service-booking-data';
import { servicebookingColumn } from './columns';
import { useEffect, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import usePaginatedServices from '@/hooks/services/usePaginatedServices';
import PageLoader from '@/app/shared/page-loader';
import {
  serviceDataType,
  serviceStatusChangeDataType,
} from '@/data/service-data';
import { useServiceById } from '@/hooks/services/useServiceById';

export default function ServiceBookingTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePaginatedServices(pagination);

  const pageCount =
    data?.pages?.flatMap((page: any) => page?.data.total_pages) || 1;
  console.log('data............', data);

  const { table, setData } = useTanStackTable<serviceDataType | any>({
    tableData: [],
    columnConfig: servicebookingColumn,
    options: {
      meta: {
        handleDeleteRow: (row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        },
        handleMultipleDelete: (rows) => {
          setData((prev) => prev.filter((r) => !rows.includes(r)));
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
    if (data) {
      console.log('data??????????????', data);
      const serviceBookingAPIData =
        data?.pages
          .flatMap((page: any) => page?.data?.results)
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          ) || [];

      setData(serviceBookingAPIData);
    }
  }, [data]);

  if (isLoading) return <PageLoader />;
  return (
    <>
      <Filters table={table} />
      <Table
        table={table}
        variant="modern"
        classNames={{
          container: 'border border-muted rounded-md',
          rowClassName: 'last:border-0',
        }}
      />
      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </>
  );
}
