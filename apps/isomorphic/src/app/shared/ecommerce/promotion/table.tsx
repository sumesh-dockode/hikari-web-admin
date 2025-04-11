'use client';

import { useState } from 'react';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from '../review/filters';
import { promotionData } from '@/data/promotion-data';
import { PromotionColumn } from './columns';
import PromotionModal from '../product/create-edit/promotion-modal';
import { PaginationState } from '@tanstack/react-table';

export type PromotionDataType = (typeof promotionData)[number];

export default function PromotionsTable() {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedRow, setSelectedRow] = useState<PromotionDataType | null>(
  //   null
  // );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pageCount = 1;

  const { table, setData } = useTanStackTable<PromotionDataType>({
    tableData: promotionData,
    columnConfig: PromotionColumn,
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

  return (
    <>
      <Filters table={table} />
      <Table
        table={table}
        variant="modern"
        classNames={{
          container: 'border border-muted rounded-md',
          rowClassName: 'last:border-0 cursor-pointer',
        }}
        // onRowClick={(row: any) => handleRowClick(row.original)}
      />

      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />

      {/* {isModalOpen && selectedRow && (
        <PromotionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          rowData={{
            id: 0,
            productname: '',
            promotionmedium: '',
            comments: '',
          }}
        />
      )} */}
    </>
  );
}
