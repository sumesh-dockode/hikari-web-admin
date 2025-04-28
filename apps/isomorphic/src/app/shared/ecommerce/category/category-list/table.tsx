'use client';

import {  CategoryDataType } from '@/data/product-categories';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { categoriesColumns } from './columns';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { useEffect, useState } from 'react';
import usePaginatedCategories from '@/hooks/categories/usePaginatedCategories';
import { useDeleteCategory } from '@/hooks/categories/useDeleteCategories';
import PageLoader from '@/app/shared/page-loader';
import toast from 'react-hot-toast';
import { PaginationState } from '@tanstack/react-table';

export default function CategoryTable() {
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
  } = usePaginatedCategories(pagination);
  const { mutate: deleteCategory, status: deleteStatus } = useDeleteCategory();

  const pageCount =
    data?.pages?.flatMap((page: any) => page?.data.total_pages) || 1;

  const { table, setData } = useTanStackTable<CategoryDataType | any>({
    tableData: [],
    columnConfig: categoriesColumns,
    options: {
      meta: {
        handleDeleteRow: (row) => {
          deleteCategory(row.id, {
            onSuccess: () => {
              toast.success('Category deleted successfully');
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
      const categoriesAPIData =
        data?.pages?.flatMap((page: any) => page?.data?.results) || [];
      setData(categoriesAPIData);
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