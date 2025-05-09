'use client';


import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { storeManagerColumns } from './columns';
import { useEffect, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import usePaginatedStoreManager from '@/hooks/storeManager/usePaginatedStoreManager';
import { useDeleteStoreManager } from '@/hooks/storeManager/useDeleteStoreManager';
import PageLoader from '@/app/shared/page-loader';
import toast from 'react-hot-toast';
import { StoreManagerTableDataType } from '@/data/store-manager-data';

export default function StoreManagerTable() {
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
  } = usePaginatedStoreManager(pagination);
  const { mutate: deleteStoreManager, status: deleteStatus } =
    useDeleteStoreManager();

  const pageCount =
    data?.pages?.flatMap((page: any) => page?.data.total_pages) || 1;

  const { table, setData } = useTanStackTable<StoreManagerTableDataType>({
    tableData: [],
    columnConfig: storeManagerColumns,
    options: {
      meta: {
        handleDeleteRow: (row) => {
          deleteStoreManager(row.id, {
            onSuccess: () => {
              toast.success('Store Manager deleted successfully');
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
      const APIData =
        data?.pages?.flatMap((page: any) => page?.data?.results) || [];
      setData(APIData);
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
