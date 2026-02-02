'use client';

import { useEffect, useState } from 'react';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import type { ColumnDef } from '@tanstack/react-table';
import TableFooter from '@core/components/table/footer';
import { TableClassNameProps } from '@core/components/table/table-types';
import cn from '@core/utils/class-names';
import { exportToCSV } from '@core/utils/export-to-csv';

import { productsListColumns } from './columns';
import { ProductType } from './products-data';
import EditUserModal from './edit-barcode-item';
import toast from 'react-hot-toast';

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
}: {
  pageSize?: number;
  hideFilters?: boolean;
  hidePagination?: boolean;
  hideFooter?: boolean;
  classNames?: TableClassNameProps;
  paginationClassName?: string;
  enableRowSelection?: boolean;
  initialSelection?: any[];
  onSelectionChange?: (selected: any[]) => void;
}) {
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState<ProductType | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const { table, setData } = useTanStackTable<ProductType>({
    tableData: [],
    columnConfig: productsListColumns as ColumnDef<ProductType>[],
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: pageSize,
        },
      },
      meta: {
        handleEditRow: (row: ProductType) => {
          setEditRow(row);
          setEditOpen(true);
        },

        handleDeleteRow: async (row: ProductType) => {
          const productId = row.id;

          try {
            const accessToken = localStorage.getItem('access');
            if (!accessToken) {
              toast('Access token missing');
              return;
            }

            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/jewelry/barcode/swa/${productId}/`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (!res.ok) {
              const err: any = await res.json().catch(() => ({}));
              toast(err?.message || 'Delete failed');
              return;
            }

            setData((prev) => prev.filter((r) => r.id !== productId));
            toast('Deleted ');
          } catch (error) {
            console.log('Delete Error:', error);
            toast('Delete failed ');
          }
        },

        handleMultipleDelete: (rows: ProductType[]) => {
          setData((prev) => prev.filter((r) => !rows.includes(r)));
        },
      },

      enableColumnResizing: false,
    },
  });

  const handleUpdateUser = async (values: {
    name: string;
    category: string;
    sku: string;
    price: string;
    stock: number;
    status: string;

    barcode: string;
    grossweight: number;
    diamondnumbers: number;
    colourstonenumber: number;
    colourstoneweight: number;
    metaltype: string;
  }) => {
    if (!editRow?.id) return;

    try {
      setEditLoading(true);

      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        toast('Access token missing');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jewelry/barcode/swa/${editRow.id}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: values.name,
            category: values.category,
            sku: values.sku,
            price: values.price,
            stock: values.stock,
            status: values.status,
            bar_code: values.barcode,
            gross_weight: values.grossweight,
            diamond_count: values.diamondnumbers,
            color_stone_number: values.colourstonenumber,
            color_stone_weight: values.colourstoneweight,
            metal_type: values.metaltype,
          }),
        }
      );

      if (!res.ok) {
        const err: any = await res.json().catch(() => ({}));
        toast(err?.message || 'Update failed');
        return;
      }

      setData((prev) =>
        prev.map((item) =>
          item.id === editRow.id
            ? {
                ...item,
                name: values.name,
                category: values.category,
                sku: values.sku,
                price: values.price,
                stock: values.stock,
                status: values.status,

                barcode: values.barcode,
                grossweight: values.grossweight,
                diamondnumbers: values.diamondnumbers,
                colourstonenumber: values.colourstonenumber,
                colourstoneweight: values.colourstoneweight,
                metaltype: values.metaltype,
              }
            : item
        )
      );

      setEditOpen(false);
      setEditRow(null);
      toast('Updated ');
    } catch (error) {
      console.log('Update Error:', error);
      toast('Update failed ');
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
          console.log('access token missing');
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jewelry/barcode/swa/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) {
          console.log('API Error Status:', res.status);
          return;
        }

        const result = (await res.json()) as any;
        const rawProducts = Array.isArray(result?.data) ? result.data : [];

        const formattedProducts: ProductType[] = rawProducts.map((item: any) => ({
          id: String(item.id ?? ''),
          name: item.name ?? '',
          category: item.category ?? '',
          image: item.image_url ?? '',
          sku: String(item.sku ?? ''),
          stock: Number(item.stock ?? 0),
          price: String(item.price ?? '0'),
          status: String(item.status ?? 'Draft'),

          barcode: String(item.bar_code ?? ''),
          rating: [],
          grossweight: Number(item.gross_weight ?? 0),
          diamondnumbers: Number(item.diamond_count ?? 0),
          colourstonenumber: Number(item.color_stone_number ?? 0),
          colourstoneweight: Number(item.color_stone_weight ?? 0),
          metaltype: String(item.metal_type ?? ''),
        }));

        setData(formattedProducts);
      } catch (error) {
        console.log('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setData]);

  const selectedData = table.getSelectedRowModel().rows.map((row) => row.original);

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

      {loading && (
        <div className="py-3 text-sm text-gray-500">Loading products...</div>
      )}

      <Table table={table} variant="modern" classNames={classNames} />

      {!hideFooter && <TableFooter table={table} onExport={handleExportData} />}

      {!hidePagination && (
        <TablePagination
          table={table}
          className={cn('py-4', paginationClassName)}
        />
      )}

      {/* ✅ EDIT MODAL */}
      {editOpen && editRow && (
        <EditUserModal
          isOpen={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditRow(null);
          }}
          row={editRow}
          onSubmit={handleUpdateUser}
          loading={editLoading}
        />
      )}
    </>
  );
}
