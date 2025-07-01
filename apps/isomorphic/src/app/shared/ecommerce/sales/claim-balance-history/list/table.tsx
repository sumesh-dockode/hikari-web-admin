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
import { useState,useEffect } from 'react';
import { PaginationState } from '@tanstack/react-table';
import usePaginatedClaimBalanceHistory from '@/hooks/sales/claimBalance/usePaginatedClaimBalanceHistory';

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


interface RedeemInfo {
  upi_id?: string | null;
  bank_name?: string | null;
  ifsc_code?: string | null;
  branch_name?: string | null;
  account_number?: string | null;
  account_holder_name?: string | null;
}

// export type ClaimBalanceHistoryDataType =
//   (typeof claimBalanceHistoryData)[number];
export type ClaimBalanceHistoryDataType =
  (typeof claimBalanceHistoryData)[number] & {
    redeem_info?: RedeemInfo;
    balance?: string;
  };

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
}){

  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const { data: apiData, isLoading } = usePaginatedClaimBalanceHistory({
  pageIndex: pagination.pageIndex,
  pageSize: pagination.pageSize,
});


  // const pageCount = 1;

 const { table, setData } = useTanStackTable<ClaimBalanceHistoryDataType>({
  tableData: apiData?.data || [],
  columnConfig: ClaimBalanceHistoryColumns,
  options: {
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
      manualPagination: true,
      pageCount: apiData?.total_pages || 1,
      // pageCount: pageCount as number,
      onPaginationChange: (updater) => {
        const nextPagination =
          typeof updater === 'function' ? updater(pagination) : updater;

        setPagination(nextPagination);
      },
    },
    pagination,
  });

  useEffect(() => {
  if (apiData) {
    setData(apiData.data || []);
  }
}, [apiData, setData]);

  const selectedData = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);
  function handleExportData() {
    const headers = 'id,Claimed By,Date,Amount,Status';

    const rows = selectedData.map((row) => ({
      id: row.id,
      'Claimed By': row.claimed_by,
      Date: row.date,
      Amount: row.amount,
      Status: row.status,
    }));

    exportToCSV(rows, headers, `claim_balance_history_${selectedData.length}`);
  }

  return (
    <>
      {/* {!hideFilters && <Filters table={table} />} */}
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
