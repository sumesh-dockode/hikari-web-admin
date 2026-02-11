import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { ProductType } from '../ecommerce/product/shared/shared-types';

export function useProduct2Table() {
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState<ProductType | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const queryClient = useQueryClient();

  const downloadRowItem = (row: ProductType) => {
    if (!row.attachment) {
      toast('No attachment available for download');
      return;
    }

    const link = document.createElement('a');
    link.href = row.attachment;
    link.download = `stock-batch-${row.id}.zip`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const retryDownloadRowItem = async (row: ProductType) => {
    try {
      const session = await getSession();
      const token = session?.accessToken;

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
        const errorData = await res.json().catch(() => ({}));
        toast((errorData as any)?.message || 'Download failed');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `stock-batch-${row.id}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast('Download failed');
    }
  };

  const handleDeleteRow = async (row: ProductType) => {
    console.log('Delete called for row:', row);
    try {
      const session = await getSession();
      const token = session?.accessToken; // Fixed: accessToken is at root level
      
      console.log('Session:', session);
      console.log('Token:', token ? 'exists' : 'missing');
      
      if (!token) {
        toast.error('Access token missing');
        return;
      }

      const deleteUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/stock-batches/${row.id}/`;
      console.log('DELETE URL:', deleteUrl);

      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);

      const result = await res.json().catch(() => ({})) as any;
      console.log('Response body:', result);

      if (!res.ok) {
        toast.error(result?.message || 'Delete failed');
        return;
      }

      toast.success(result?.message || 'Stock batch deleted successfully');
      
      // Invalidate and refetch the query to update the table
      console.log('Invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['baseProductTable'] });
      console.log('Queries invalidated');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Delete failed');
    }
  };

  const tableConfig = {
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/stock-batches/`,
    dataTransformer: (result: any): ProductType[] => {
      // API response structure: { total_pages: 5, count: 41, results: [...] }
      const rawData = Array.isArray(result?.results)
        ? result.results
        : Array.isArray(result?.data?.results)
        ? result.data.results
        : [];

      return rawData.map((item: any) => {
        const product = item.product_variant.product;
        const variant = item.product_variant;

        return {
          id: item.id,
          name: product.name,
          category: product.label,
          image: variant.image,
          sku: variant.sku,
          price: product.price,
          stock: item.stocks_count || 0,
          count: String(item.stocks_count || 0),
          status: 'Active',
          time: item.created_at || '',
          product_images: variant.image ? [variant.image] : [],
          description: product.description || '',
          attachment: item.attachment || null,
        };
      });
    },
    pageCountExtractor: (result: any) => {
      // API response structure: { total_pages: 5, count: 41, results: [...] }
      return result?.total_pages || result?.data?.total_pages || -1;
    },
  };

  const customActions = {
    handleEditRow: (row: ProductType) => {
      setEditRow(row);
      setEditOpen(true);
    },
    handleDownloadRow: downloadRowItem,
    handleRetryDownloadRow: retryDownloadRowItem,
    handleDeleteRow: handleDeleteRow,
  };

  return {
    editOpen,
    setEditOpen,
    editRow,
    setEditRow,
    editLoading,
    tableConfig,
    customActions,
  };
}
