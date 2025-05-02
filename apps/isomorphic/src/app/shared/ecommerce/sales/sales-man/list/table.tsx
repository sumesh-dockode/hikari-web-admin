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

const storeManagerList = [
  {
    id: 1,
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/categories/bags.webp',
    name: 'Sales Man',
    email: '1kTt2@example.com',
    phone: '(123) 456-7890',
    address: '123 Main St, Anytown, USA',
    status: 'active',
  },
  {
    id: 2,
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/categories/bags.webp',
    name: 'Jane Smith',
    email: '5M0x3@example.com',
    phone: '(987) 654-3210',
    address: '456 Elm St, Anytown, USA',
    status: 'inactive',
  },
];

export type SalesManDataType = (typeof storeManagerList)[number];

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

  const { table, setData } = useTanStackTable<SalesManDataType>({
    tableData: storeManagerList,
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
