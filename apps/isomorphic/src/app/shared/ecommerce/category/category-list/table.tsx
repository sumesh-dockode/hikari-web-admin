'use client';

import {  CategoryDataType } from '@/data/product-categories';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { categoriesColumns } from './columns';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { useEffect } from 'react';
import usePaginatedCategories from '@/hooks/categories/usePaginatedCategories';
import { useDeleteCategory } from '@/hooks/categories/useDeleteCategories';
import PageLoader from '@/app/shared/page-loader';
import toast from 'react-hot-toast';

export default function CategoryTable() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaginatedCategories();

  const { mutate: deleteCategory, status: deleteStatus } = useDeleteCategory();
  const categoriesAPIData =
    data?.pages?.flatMap((page: any) => page?.data) || [];

  const { table, setData } = useTanStackTable<CategoryDataType | any>({
    tableData: categoriesAPIData,
    columnConfig: categoriesColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: (row) => {
          deleteCategory(row.id, {
            onSuccess: () => {
              toast.success('Category deleted successfully');
              // setData((prev) => prev.filter((r) => r.id !== row.id));
            },
          });
        },
        handleMultipleDelete: (rows) => {
          setData((prev) => prev.filter((r) => !rows.includes(r)));
        },
      },
      enableColumnResizing: false,
    },
  });
  useEffect(() => {
    const categoriesAPIData =
      data?.pages?.flatMap((page: any) => page?.data) || [];

    if (categoriesAPIData.length > 0) {
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
      {hasNextPage && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}