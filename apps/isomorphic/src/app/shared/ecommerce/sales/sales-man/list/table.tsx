'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { salesManColumns } from './columns';
import { useEffect, useMemo, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import usePaginatedSalesMan from '@/hooks/sales/salesman/usePaginatedSalesMan';
import { useDeleteSalesMan } from '@/hooks/sales/salesman/useDeleteSalesMan';
import toast from 'react-hot-toast';
import PageLoader from '@/app/shared/page-loader';
import { SalesmanDataType } from '@/data/salesman-data';
import { debounce } from 'lodash';

interface FiltersProps {
  search?: string;
}

export default function SalesManTable() {
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState & FiltersProps>({
    pageIndex: 0,
    pageSize: 10,
    search: '',
  });
  const { data, isLoading } = usePaginatedSalesMan(pagination);
  const { mutate: deleteSalesman, status: deleteStatus } = useDeleteSalesMan();
  const pageCount = data?.data?.total_pages || 1;

  const { table, setData } = useTanStackTable<SalesmanDataType>({
    tableData: [],
    columnConfig: salesManColumns,
    options: {
      meta: {
        handleDeleteRow: (row) => {
          setDeleteItemId(row.id);
          deleteSalesman(row.id, {
            onSuccess: () => {
              toast.success('Salesman deleted successfully');
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
      const salesManAPIData = data?.data?.results || [];
      setData(salesManAPIData);
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
