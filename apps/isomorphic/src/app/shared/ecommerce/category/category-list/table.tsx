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
import { debounce } from 'lodash';

interface FiltersProps {
  search?: string;
}

export default function CategoryTable() {
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState & FiltersProps>({
    pageIndex: 0,
    pageSize: 10,
    search: '',
  });

  const { data, isLoading } = usePaginatedCategories(pagination);
  const { mutate: deleteCategory, status: deleteStatus } = useDeleteCategory();

  const pageCount = data?.data?.total_pages || 1;

  const { table, setData } = useTanStackTable<CategoryDataType | any>({
    tableData: [],
    columnConfig: categoriesColumns,
    options: {
      meta: {
        handleDeleteRow: (row) => {
          setDeleteItemId(row.id);
          deleteCategory(row.id, {
            onSuccess: () => {
              toast.success('Category deleted successfully');
            },
          });
        },
        deleteId: deleteItemId,
        isDeleting: deleteStatus === 'pending',
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
      const categoriesAPIData = data?.data?.results || [];
      setData(categoriesAPIData);
    }
  }, [data]);

  const handleSearchChange = debounce((value: string) => {
    setPagination((prev) => ({
      ...prev,
      search: value,
      pageIndex: 0,
    }));
  }, 500);

  if (isLoading) return <PageLoader />;

  return (
    <>
      <Filters
        table={table}
        handleSearchChange={handleSearchChange}
        searchText={pagination.search}
      />
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