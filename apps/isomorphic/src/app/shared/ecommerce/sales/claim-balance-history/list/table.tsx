'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import TableFooter from '@core/components/table/footer';
import { TableClassNameProps } from '@core/components/table/table-types';
import cn from '@core/utils/class-names';
import { exportToCSV } from '@core/utils/export-to-csv';
import Filters from './filters';
import { ClaimBalanceHistoryColumns } from './columns';

const claimBalanceHistoryData = [
  {
    id: 1,
    claimed_by: 'John Britas',
    date: '2023-06-01',
    amount: '10.00',
    status: 'completed',
  },
  {
    id: 2,
    claimed_by: 'Anupama Das',
    date: '2023-06-02',
    amount: '120.00',
    status: 'pending',
  },
  {
    id: 3,
    claimed_by: 'Shifna Disuza',
    date: '2023-06-03',
    amount: '40.00',
    status: 'cancelled',
  },
];

export type ClaimBalanceHistoryDataType =
  (typeof claimBalanceHistoryData)[number];

export default function ClaimBalanceHistoryTable({
  pageSize = 5,
  hideFilters = false,
  hidePagination = false,
  hideFooter = false,
  classNames = {
    container: 'border border-muted rounded-md',
    rowClassName: 'last:border-0',
  },
  paginationClassName,
}: {
  pageSize?: number;
  hideFilters?: boolean;
  hidePagination?: boolean;
  hideFooter?: boolean;
  classNames?: TableClassNameProps;
  paginationClassName?: string;
}) {
  const { table, setData } = useTanStackTable<ClaimBalanceHistoryDataType>({
    tableData: claimBalanceHistoryData,
    columnConfig: ClaimBalanceHistoryColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: pageSize,
        },
      },
      meta: {
        handleDeleteRow: (row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        },
        handleMultipleDelete: (rows) => {
          setData((prev) => prev.filter((r) => !rows.includes(r)));
        },
        handleApproveRow: (row) => {},
      },
      enableColumnResizing: false,
    },
  });

  const selectedData = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  function handleExportData() {
    exportToCSV(
      selectedData,
      'ID,Name,Category,Sku,Price,Stock,Status,Rating',
      `product_data_${selectedData.length}`
    );
  }

  return (
    <>
      {!hideFilters && <Filters table={table} />}
      <Table table={table} variant="modern" classNames={classNames} />
      {!hideFooter && <TableFooter table={table} onExport={handleExportData} />}
      {!hidePagination && (
        <TablePagination
          table={table}
          className={cn('py-4', paginationClassName)}
        />
      )}
    </>
  );
}
