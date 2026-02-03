'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [pageCount, setPageCount] = useState(-1);

  // Check authentication on mount
  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    const refreshToken = localStorage.getItem('refresh');
    
    if (!accessToken && !refreshToken) {
      router.push('/signin');
    }
  }, [router]);

  const { table, setData } = useTanStackTable<ProductType>({
    tableData: [],
    columnConfig: productsListColumns,
    options: {
      initialState: {
        pagination: { pageIndex: 0, pageSize },
      },
      manualPagination: true,
      pageCount: pageCount,
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

        const currentPage = table.getState().pagination.pageIndex + 1;
        const currentPageSize = table.getState().pagination.pageSize;

        console.log('Fetching page:', currentPage, 'pageSize:', currentPageSize);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/product-items/?page=${currentPage}&page_size=${currentPageSize}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!res.ok) return;

        const result = await res.json()as any;
        console.log('API Response:', result);
        
        // Data is in result.data.results, not result.data
        const rawProducts = Array.isArray(result?.data?.results) ? result.data.results : [];

        // Update page count from backend response
        if (result?.data?.total_pages) {
          console.log('Setting pageCount to:', result.data.total_pages);
          setPageCount(result.data.total_pages);
        }

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

        console.log('Formatted products:', formatted);
        setData(formatted);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize, setData, table]);

  // Update table's pageCount when state changes
  useEffect(() => {
    if (pageCount >= 0) {
      table.setPageCount(pageCount);
    }
  }, [pageCount, table]);

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
