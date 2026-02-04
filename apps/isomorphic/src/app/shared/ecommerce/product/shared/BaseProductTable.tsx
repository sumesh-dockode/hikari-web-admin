'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import Table from '@core/components/table';
import TablePagination from '@core/components/table/pagination';
import TableFooter from '@core/components/table/footer';
import TableSkeleton from './TableSkeleton';
import cn from '@core/utils/class-names';
import toast from 'react-hot-toast';
import { useBaseProductData } from '@/app/shared/hooks/useBaseProductData';
import { ProductType, TableConfig, CustomActions } from './shared-types';
import { ColumnDef } from '@tanstack/react-table';

interface BaseProductTableProps {
  config: TableConfig;
  columnConfig: ColumnDef<ProductType>[];
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
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

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
              const token = localStorage.getItem('access');
              
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
    search,
  });

  // Update table data when formatted data changes
  useEffect(() => {
    setData(formattedData);
  }, [formattedData, setData]);

  // Update page count when it changes
  useEffect(() => {
    if (totalPages >= 0) {
      setPageCount(totalPages);
    }
  }, [totalPages]);

  return (
    <>
      {!hideFilters && renderFilters && renderFilters(table)}

      {isLoading ? (
        <div className={cn(classNames?.container, "overflow-x-auto")}>
          <table className="w-full">
            <thead className="border-b border-muted">
              <tr>
                {columnConfig.map((col, idx) => (
                  <th key={idx} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {typeof col.header === 'function' ? '' : (col.header as string)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <TableSkeleton rows={pageSize} columns={columnConfig.length} />
            </tbody>
          </table>
        </div>
      ) : (
        <Table 
          table={table} 
          variant="modern" 
          classNames={{
            container: classNames?.container,
            rowClassName: classNames?.rowClassName,
          }} 
          isLoading={isLoading}
        />
      )}

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
