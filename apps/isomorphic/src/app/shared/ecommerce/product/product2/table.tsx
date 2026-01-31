'use client';

import { useEffect, useState } from 'react';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import TableFooter from '@core/components/table/footer';
import cn from '@core/utils/class-names';
import toast from 'react-hot-toast';

import { productsListColumns } from './columns';
import { ProductType } from './products-data';
import EditUserModal from './edit-barcode-item';

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
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState<ProductType | null>(null);
  const [editLoading, setEditLoading] = useState(false);
const downloadRowItem = async (row: ProductType) => {
  try {
    const token = localStorage.getItem('access');
    if (!token) {
      toast('Access token missing');
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/stock-batches/${row.id}/download/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      toast('Download failed');
      return;
    }

    const blob = await res.blob();

    const disposition = res.headers.get('content-disposition');
    let fileName = `${row.name}-${row.id}.zip`;

    if (disposition && disposition.includes('filename=')) {
      fileName = disposition
        .split('filename=')[1]
        .replace(/"/g, '')
        .trim();
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);

    toast('ZIP download started');
  } catch (error) {
    console.error('Download Error:', error);
    toast('Download failed');
  }
};


  const { table, setData } = useTanStackTable<ProductType>({
    tableData: [],
    columnConfig: productsListColumns,
    options: {
      initialState: {
        pagination: { pageIndex: 0, pageSize },
      },
      meta: {
        handleEditRow: (row: ProductType) => {
          setEditRow(row);
          setEditOpen(true);
        },

        handleDownloadRow: downloadRowItem,

        handleDeleteRow: async (row: ProductType) => {
          try {
            const token = localStorage.getItem('access');
            if (!token) return;

            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/product-items/${row.id}/`,
              {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            setData((prev) => prev.filter((r) => r.id !== row.id));
            toast('Deleted');
          } catch {
            toast('Delete failed');
          }
        },
      },
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access');
        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/stock-batches/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = await res.json()as any;

        const formatted: ProductType[] = result.data.map((item: any) => {
          const product = item.product_variant.product;
          const variant = item.product_variant;

          return {
            id: item.id,
            name: product.name,
            category: product.label,
            image: variant.image,
            sku: variant.sku,
            stock: item.stocks_count,
            count: item.stocks_count,
            status: 'Active',
            time: item.created_at,
          };
        });

        setData(formatted);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setData]);

  /* ================= RENDER ================= */
  return (
    <>
      {!hideFilters && <Filters table={table} />}

      {loading && (
        <div className="py-3 text-sm text-gray-500">Loading products...</div>
      )}

      <Table table={table} variant="modern" classNames={classNames} />

      {!hideFooter && <TableFooter table={table} />}

      {!hidePagination && (
        <TablePagination
          table={table}
          className={cn('py-4', paginationClassName)}
        />
      )}

      {editOpen && editRow && (
        <EditUserModal
          isOpen={editOpen}
          row={editRow}
          loading={editLoading}
          onClose={() => {
            setEditOpen(false);
            setEditRow(null);
          } } onSubmit={function (values: { name: string; sku: string; category: string; price: string; barcode: string; grossweight: number; diamondnumbers: number; colourstoneweight: number; colourstonenumber: number; metaltype: string; stock: number; status: string; }): Promise<void> | void {
            throw new Error('Function not implemented.');
          } }        />
      )}
    </>
  );
}
