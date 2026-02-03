'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import TableFooter from '@core/components/table/footer';
import cn from '@core/utils/class-names';
import toast from 'react-hot-toast';
import { ColumnDef } from '@tanstack/react-table';

import { ProductType, TableConfig, CustomActions } from './shared-types';
import { useBaseProductData } from '../../../hooks/useBaseProductData';

export interface BaseProductTableProps {
  config: TableConfig;
  columnConfig: ColumnDef<ProductType, any>[];
  customActions?: CustomActions;
  renderFilters?: (table: any) => ReactNode;
  editModal?: ReactNode;
  pageSize?: number;
  hideFilters?: boolean;
  hidePagination?: boolean;
  hideFooter?: boolean;
  classNames?: {
    container?: string;
    rowClassName?: string;
  };
  paginationClassName?: string;
}

export default function BaseProductTable({
  config,
  columnConfig,
  customActions,
  renderFilters,
  editModal,
  pageSize = 5,
  hideFilters = false,
  hidePagination = false,
  hideFooter = false,
  classNames = {
    container: 'border border-muted rounded-md',
    rowClassName: 'last:border-0',
  },
  paginationClassName,
}: BaseProductTableProps) {
  const router = useRouter();

  // Auth check
  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    const refreshToken = localStorage.getItem('refresh');
    
    if (!accessToken && !refreshToken) {
      router.push('/signin');
    }
  }, [router]);

  const [pageCount, setPageCount] = useState(-1);

  const { table, setData } = useTanStackTable<ProductType>({
    tableData: [],
    columnConfig: columnConfig,
    options: {
      initialState: {
        pagination: { pageIndex: 0, pageSize },
      },
      manualPagination: true,
      pageCount: pageCount, 
      meta: {
        ...customActions,
        handleDeleteRow: async (row: ProductType) => {
          if (customActions?.handleDeleteRow) {
            await customActions.handleDeleteRow(row);
          } else {
            try {
              const session = await getSession();
              const token = session?.accessToken; 
              
              if (!token) {
                toast.error('Access token missing');
                return;
              }

              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/product-items/${row.id}/`,
                {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              const result = await res.json().catch(() => ({})) as any;

              if (!res.ok) {
                toast(result?.message || 'Delete failed');
                return;
              }

              setData((prev) => prev.filter((r) => r.id !== row.id));
              toast(result?.message || 'Deleted successfully');
            } catch (error) {
              console.error('Delete error:', error);
              toast('Delete failed');
            }
          }
        },
      } as any,
    },
  });

  // Fetch products using custom hook
  const currentPage = table.getState().pagination.pageIndex + 1;
  const currentPageSize = table.getState().pagination.pageSize;

  const { data: formattedData, totalPages, isLoading } = useBaseProductData({
    config,
    currentPage,
    currentPageSize,
  });

  // Update table data when formatted data changes
  useEffect(() => {
    setData(formattedData);
  }, [formattedData]);

  // Update page count when it changes
  useEffect(() => {
    if (totalPages >= 0) {
      setPageCount(totalPages);
    }
  }, [totalPages]);

  return (
    <>
      {!hideFilters && renderFilters && renderFilters(table)}

      {isLoading && (
        <div className="py-3 text-sm text-gray-500">Loading products...</div>
      )}

      <Table table={table} variant="modern" classNames={classNames} />

      {!hideFooter && <TableFooter table={table} />}

      {!hidePagination && (
        <TablePagination
          table={table}
          className={cn('py-4', paginationClassName)}
        />
      )}

      {editModal}
    </>
  );
}
