'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import TableFooter from '@core/components/table/footer';
import { TableClassNameProps } from '@core/components/table/table-types';
import cn from '@core/utils/class-names';
import { exportToCSV } from '@core/utils/export-to-csv';
import Filters from './filters';
import { SalesHistoryColumns } from './columns';
import { useEffect, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import usePaginatedSalesHistory from '@/hooks/sales/salesHistory/usePaginatedSalesHistory';
import { SalesHistoryDataType } from '@/data/saleshistory-data';
import PageLoader from '@/app/shared/page-loader';

interface FiltersProps {
  search?: string;
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
