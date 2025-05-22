'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import TableFooter from '@core/components/table/footer';
import Filters from './filters';
import { SalesHistoryColumns } from './columns';
import { useEffect, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import usePaginatedSalesHistory from '@/hooks/sales/salesHistory/usePaginatedSalesHistory';
import { SalesHistoryDataType } from '@/data/saleshistory-data';
import PageLoader from '@/app/shared/page-loader';
import { debounce } from 'lodash';

interface FiltersProps {
  search?: string;
  sold_by?: number;
}

export default function SalesHistoryTable() {
  const [pagination, setPagination] = useState<PaginationState & FiltersProps>({
    pageIndex: 0,
    pageSize: 10,
    search: '',
  });
  const { data, isLoading } = usePaginatedSalesHistory(pagination);
  const pageCount = data?.data?.total_pages || 1;

  const { table, setData } = useTanStackTable<SalesHistoryDataType>({
    tableData: [],
    columnConfig: SalesHistoryColumns,
    options: {
      meta: {
        handleDeleteRow: (row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
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

  const handleSalesManFilter = (value?: number) => {
    setPagination((prev) => ({
      ...prev,
      sold_by: value,
    }));
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      <Filters
        table={table}
        handleSearchChange={handleSearchChange}
        searchText={pagination.search}
        salesManFilter={pagination.sold_by}
        handleSalesManFilter={handleSalesManFilter}
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
