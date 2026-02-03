'use client';

import { productsListColumns } from './columns';
import EditUserModal from './edit-barcode-item';
import BaseProductTable from '../shared/BaseProductTable';
import Filters from './filters';
import { useProduct2Table } from '../../../hooks/useProduct2Table';

export default function ProductsTable({
  pageSize = 5,
  hideFilters = false,
  hidePagination = false,
  hideFooter = false,
  classNames = {
    container: 'border border-muted rounded-md',
    rowClassName: 'last:border-0',
  },
  paginationClassName,
}: any) {
  const {
    editOpen,
    setEditOpen,
    editRow,
    setEditRow,
    editLoading,
    tableConfig,
    customActions,
  } = useProduct2Table();

  return (
    <BaseProductTable
      config={tableConfig}
      columnConfig={productsListColumns as any}
      customActions={customActions}
      renderFilters={(table) => <Filters table={table} />}
      pageSize={pageSize}
      hideFilters={hideFilters}
      hidePagination={hidePagination}
      hideFooter={hideFooter}
      classNames={classNames}
      paginationClassName={paginationClassName}
      editModal={
        editOpen && editRow ? (
          <EditUserModal
            isOpen={editOpen}
            row={editRow}
            loading={editLoading}
            onClose={() => {
              setEditOpen(false);
              setEditRow(null);
            }}
            onSubmit={function (values: {
              name: string;
              sku: string;
              category: string;
              price: string;
              barcode: string;
              grossweight: number;
              diamondnumbers: number;
              colourstoneweight: number;
              colourstonenumber: number;
              metaltype: string;
              stock: number;
              status: string;
            }): Promise<void> | void {
              throw new Error('Function not implemented.');
            }}
          />
        ) : null
      }
    />
  );
}
