'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { salesManColumns } from './columns';
import { useEffect, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import usePaginatedSalesMan from '@/hooks/sales/salesman/usePaginatedSalesMan';
import { useDeleteSalesMan } from '@/hooks/sales/salesman/useDeleteSalesMan';
import toast from 'react-hot-toast';
import PageLoader from '@/app/shared/page-loader';
import { SalesmanDataType } from '@/data/salesman-data';

export default function SalesManTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaginatedSalesMan(pagination);
  const { mutate: deleteSalesman, status: deleteStatus } = useDeleteSalesMan();

  const pageCount =
    data?.pages?.flatMap((page: any) => page?.data.total_pages) || 1;

  const { table, setData } = useTanStackTable<SalesmanDataType>({
    tableData: [],
    columnConfig: salesManColumns,
    options: {
      meta: {
        handleDeleteRow: (row) => {
          deleteSalesman(row.id, {
            onSuccess: () => {
              toast.success('Salesman deleted successfully');
            },
          });
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
      const salesManAPIData =
        data?.pages?.flatMap((page: any) => page?.data?.results) || [];
      setData(salesManAPIData);
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
