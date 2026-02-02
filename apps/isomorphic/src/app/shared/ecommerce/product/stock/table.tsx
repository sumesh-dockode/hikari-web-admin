'use client';

import { useEffect, useState } from 'react';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import TableFooter from '@core/components/table/footer';
import Filters from './filters';
import cn from '@core/utils/class-names';
import toast from 'react-hot-toast';

import { productsListColumns } from './columns';
import { ProductType } from './products-data';
import EditProductModal, { EditProductValues } from './edit-barcode-item';

export default function ProductsTable({
  pageSize = 5,
}: {
  pageSize?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const { table, setData } = useTanStackTable<ProductType>({
    tableData: [],
    columnConfig: productsListColumns,
    options: {
      initialState: {
        pagination: { pageIndex: 0, pageSize },
      },
      meta: {
        handleEditRow: (row: ProductType) => {
          setEditItemId(row.id);
          setEditOpen(true);
        },
      },
    },
  });

const handleUpdateProduct = async (values: EditProductValues) => {
  console.log('PUT CALLED', values); 

  try {
    setEditLoading(true);

    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      toast('Access token missing');
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/product-items/${values.productItemId}/`,
      {
        method:'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: values.name,
          price: values.price,
          sku: values.variantSku,
          description: values.description,
          specifications: values.specifications, 
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))as any;
      toast(String(err?.message) || 'Update failed');
      return;
    }

    setData((prev) =>
      prev.map((item) =>
        item.id === values.productItemId
          ? {
              ...item,
              name: values.name,
              category: values.label,
              price: String(values.price),
              sku: values.variantSku ?? '',
            }
          : item
      )
    );

    toast('Updated');
    setEditOpen(false);
    setEditItemId(null);
  } catch (e) {
    console.error(e);
    toast('Update failed');
  } finally {
    setEditLoading(false);
  }
};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const accessToken = localStorage.getItem('access');
        if (!accessToken) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/product-items/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!res.ok) return;

        const result = await res.json()as any;
        const rawProducts = Array.isArray(result?.data) ? result.data : [];

        const formatted: ProductType[] = rawProducts.map((item: any) => ({
          id: String(item.id),
          name: item.product?.name ?? '',
          category: item.product?.label ?? '',
          image: item.image ?? '',
          sku: item.sku ?? '',
          price: item.product?.price ?? '',
          stock: 0,
          count: '0',
          status: 'Active',
          time: '',
        }));

        setData(formatted);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setData]);

  return (
    <>
      <Filters table={table} />

      {loading && <div className="py-3 text-sm text-gray-500">Loading products…</div>}

      <Table table={table} variant="modern" />

      <TableFooter table={table} />

      <TablePagination table={table} className={cn('py-4')} />

      {editOpen && editItemId && (
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
      )}
    </>
  );
}
