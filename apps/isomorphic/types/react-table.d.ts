import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    handleEditRow?: (row: TData) => void;

    handleDeleteRow?: (row: Row<TData>) => void;
    handleMultipleDelete?: (row: Row<TData>) => void;
    handleApproveRow?: (row: Row<TData>) => void;
    handleUnpublishRow?: (id: string) => void;
    deleteId?: string | null;
    isDeleting?: boolean;
    isLoading?: boolean;
    unpublishLoading?: boolean;
  }
  interface ColumnMeta<TData extends RowData, TValue> {
    isColumnDraggable?: boolean;
  }
}
