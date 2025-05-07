'use client';

import { productsDataType } from '@/data/products-data';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import { productsListColumns } from './columns';
import Filters from './filters';
import TableFooter from '@core/components/table/footer';
import { TableClassNameProps } from '@core/components/table/table-types';
import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import usePaginatedProducts from '@/hooks/products/usePaginatedProducts';
import { useDeleteProducts } from '@/hooks/products/useDeleteProducts';
import PageLoader from '@/app/shared/page-loader';
import { PaginationState } from '@tanstack/react-table';
import { useGetAllCategories } from '@/hooks/categories/useGetAllCategories';

interface ProductsTableProps {
  pageSize?: number;
  hideFilters?: boolean;
  hidePagination?: boolean;
  hideFooter?: boolean;
  classNames?: TableClassNameProps;
  paginationClassName?: string;
  onSelectionChange?: (selectedRows: productsDataType[]) => void;
  enableRowSelection?: boolean;
}

export default function ProductsTable({
  pageSize = 5,
  hideFilters = false,
  hidePagination = false,
  hideFooter = false,
  classNames = {
    container: 'border border-muted rounded-md',
    rowClassName: 'last:border-0',
  },
  paginationClassName,
  onSelectionChange,
  enableRowSelection = false,
}: ProductsTableProps) {
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
  } = usePaginatedProducts(pagination);
  const { mutate: deleteProduct, status: deleteStatus } = useDeleteProducts();
  const { data: categoryData, isLoading: isLoadingCategory } =
    useGetAllCategories();

  const pageCount =
    data?.pages?.flatMap((page: any) => page?.data.total_pages) || 1;

  const { table, setData } = useTanStackTable<productsDataType>({
    tableData: [],
    columnConfig: productsListColumns,
    options: {
      meta: {
        handleDeleteRow: (row) => {
          deleteProduct(row.id, {
            onSuccess: () => {
              setData((prev) => prev.filter((r) => r.id !== row.id));
            },
          });
        },
        handleMultipleDelete: (rows) => {
          deleteProduct(rows, {
            onSuccess: () => {
              setData((prev) => prev.filter((r) => !rows.includes(r)));
            },
          });
        },
      },
      enableColumnResizing: false,
      enableRowSelection: enableRowSelection,
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
    if (data && categoryData) {
      const categoryMap = new Map(
        (categoryData?.data || []).map((cat: any) => [cat.id, cat.name])
      );

      const productsAPIData =
        data?.pages?.flatMap((page: any) => page?.data?.results) || [];

      const mappedProducts = productsAPIData.map((product: any) => ({
        ...product,
        category: categoryMap.get(product.category) || product.category,
      }));

      setData(mappedProducts);
    }
  }, [data, categoryData]);

  // Get the selected rows
  const selectedData = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  // Notify parent component when selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedData);
    }
  }, []);

  if (isLoading || isLoadingCategory) return <PageLoader />;

  return (
    <>
      {/* {!hideFilters && <Filters table={table} />} */}
      <Table
        table={table}
        variant="modern"
        classNames={{
          ...classNames,
          rowClassName: cn(
            classNames.rowClassName,
            'transition-colors',
            enableRowSelection ? 'cursor-pointer' : '',
            table
              .getSelectedRowModel()
              .rows.some((row) => row.id === table.getRow(row.id).id)
              ? 'bg-gray-50'
              : ''
          ),
        }}
      />
      {!hidePagination && (
        <TablePagination
          table={table}
          className={cn('py-4', paginationClassName)}
        />
      )}
    </>
  );
}