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
import { useState } from 'react';
import { PaginationState } from '@tanstack/react-table';

const salesData = [
  {
    id: 1,
    name: 'Product 1',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/7.webp',
    invoice_number: 'INV-001',
    date: '2023-06-01',
    createdAt: '2023-06-01',
    to: 'John Britas',
    from: 'David Smith',
    price: '10.00',
    incentive: '5.00',
  },
  {
    id: 2,
    name: 'Product 2',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/7.webp',
    invoice_number: 'INV-002',
    date: '2023-06-02',
    createdAt: '2023-06-02',
    to: 'John Britas',
    from: 'David Smith',
    price: '10.00',
    incentive: '5.00',
  },
  {
    id: 3,
    name: 'Product 3',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/7.webp',
    invoice_number: 'INV-003',
    date: '2023-06-03',
    createdAt: '2023-06-03',
    to: 'John Britas',
    from: 'David Smith',
    price: '10.00',
    incentive: '5.00',
  },
];

export type SalesHistoryDataType = (typeof salesData)[number];

export default function SalesHistoryTable({
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
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pageCount = 1;

  const { table, setData } = useTanStackTable<SalesHistoryDataType>({
    tableData: salesData,
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
