'use client';

import { productsListColumns } from './columns';
import EditProductModal from './edit-barcode-item';
import BaseProductTable from '../shared/BaseProductTable';
import Filters from './filters';
import { useStockTable } from '../../../hooks/useStockTable';

export default function ProductsTable({
  pageSize = 5,
}: {
  pageSize?: number;
}) {
  const {
    editOpen,
    setEditOpen,
    editItemId,
    setEditItemId,
    editLoading,
    handleUpdateProduct,
    tableConfig,
    customActions,
  } = useStockTable();

  return (
    <BaseProductTable
      config={tableConfig}
      columnConfig={productsListColumns as any}
      customActions={customActions}
      renderFilters={(table) => <Filters table={table} />}
      pageSize={pageSize}
      editModal={
        editOpen && editItemId ? (
          <EditProductModal
            isOpen={editOpen}
            productItemId={editItemId}
            onClose={() => {
              setEditOpen(false);
              setEditItemId(null);
            }}
            onSubmit={handleUpdateProduct}
            loading={editLoading}
          />
        ) : null
      }
    />
  );
}
