'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { salesManColumns } from './columns';

const storeManagerList = [
  {
    id: 1,
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/categories/bags.webp',
    name: 'Sales Man',
    email: '1kTt2@example.com',
    phone: '(123) 456-7890',
    address: '123 Main St, Anytown, USA',
    status: 'active',
  },
  {
    id: 2,
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/categories/bags.webp',
    name: 'Jane Smith',
    email: '5M0x3@example.com',
    phone: '(987) 654-3210',
    address: '456 Elm St, Anytown, USA',
    status: 'inactive',
  },
];

export type SalesManDataType = (typeof storeManagerList)[number];

export default function SalesManTable() {
  const { table, setData } = useTanStackTable<SalesManDataType>({
    tableData: storeManagerList,
    columnConfig: salesManColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: (row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        },
        handleMultipleDelete: (rows) => {
          setData((prev) => prev.filter((r) => !rows.includes(r)));
        },
      },
      enableColumnResizing: false,
    },
  });

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
