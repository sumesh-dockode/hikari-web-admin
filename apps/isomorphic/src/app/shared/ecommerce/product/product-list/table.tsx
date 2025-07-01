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
import { usePublishProducts } from '@/hooks/products/usePublishProducts';
import { debounce } from 'lodash';
import { useUnpublishProducts } from '@/hooks/products/useUnpublishProducts';

interface ProductsTableProps {
  pageSize?: number;
  hideFilters?: boolean;
  hidePagination?: boolean;
  hideFooter?: boolean;
  classNames?: TableClassNameProps;
  paginationClassName?: string;
  onSelectionChange?: (selectedRows: productsDataType[]) => void;
  enableRowSelection?: boolean;
  initialSelection?: productsDataType[];
}

interface FiltersProps {
  search?: string;
  category?: number;
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
  initialSelection = [],
}: ProductsTableProps) {
  // const [currentId, setCurrentId] = useState(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState & FiltersProps>({
    pageIndex: 0,
    pageSize: 10,
    search: '',
  });

  const { data, isLoading } = usePaginatedProducts(pagination);
  const { mutate: publishProduct, status: publishStatus } =
    usePublishProducts();
  const { mutate: deleteProduct, status: deleteStatus } = useDeleteProducts();
  const { data: categoryData, isLoading: isLoadingCategory } =
    useGetAllCategories();
  const { mutate: unpublishProduct, status: unpublishStatus } = useUnpublishProducts();

  const pageCount = data?.data?.total_pages || 1;

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
        handleApproveRow: (id) => {
          setCurrentId(id);
          console.log(' row', id);
          publishProduct(id);
        },
        handleUnpublishRow: (id: string) => {
          setCurrentId(id);
          unpublishProduct(id);
        },
        deleteId: currentId,
        isLoading: publishStatus === 'pending',
        unpublishLoading: unpublishStatus === 'pending',
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

      const productsAPIData = data?.data?.results || [];

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

  useEffect(() => {
    if (onSelectionChange) {
      const selected = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selected);
    }
  }, [table.getSelectedRowModel().rows]);

  const handleSearchChange = debounce((value: string) => {
    setPagination((prev) => ({
      ...prev,
      search: value,
      pageIndex: 0,
    }));
  }, 500);

  const handleFilters = (filters: FiltersProps) => {
    console.log('filters', filters);

    setPagination((prev) => ({
      ...prev,
      ...filters,
      pageIndex: 0,
    }));
  };

  if (isLoading || isLoadingCategory) return <PageLoader />;

  return (
    <>
      <Filters
        table={table}
        handleSearchChange={handleSearchChange}
        searchText={pagination.search}
        handleFilters={handleFilters}
        category={pagination.category}
      />
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
