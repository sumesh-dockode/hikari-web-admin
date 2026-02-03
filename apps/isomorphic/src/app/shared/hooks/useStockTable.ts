import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ProductType } from '../ecommerce/product/shared/shared-types';

export interface EditProductValues {
  productItemId: string;
  name: string;
  label: string;
  price: number;
  variantSku?: string;
  description?: string;
  specifications?: Array<{ name: string; value: string }>;
  imageFile?: File | null;
}

export function useStockTable() {
  const [editOpen, setEditOpen] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleUpdateProduct = async (values: EditProductValues) => {
    console.log('PUT CALLED', values);

    try {
      setEditLoading(true);

      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        toast('Access token missing');
        return;
      }

      let imageBase64 = null;
      if (values.imageFile) {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(values.imageFile as File);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }

      const payload: any = {
        title: values.name,
        price: String(values.price),
        sku: values.variantSku,
        description: values.description,
        specifications: values.specifications,
      };

      if (imageBase64) {
        payload.image = imageBase64;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/product-items/${values.productItemId}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as any;
        toast(String(err?.message) || 'Update failed');
        return;
      }

      toast('Updated');
      setEditOpen(false);
      setEditItemId(null);

      // Refresh data without page reload
      queryClient.invalidateQueries({ queryKey: ['baseProductTable'] });
    } catch (e) {
      console.error(e);
      toast('Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  const tableConfig = {
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/product-items/`,
    dataTransformer: (result: any): ProductType[] => {
      // Stock API response: { status: "success", data: { total_pages: 2, results: [...] } }
      // Stock-batches API response: { total_pages: 5, results: [...] }
      const rawProducts = Array.isArray(result?.data?.results)
        ? result.data.results
        : Array.isArray(result?.results)
        ? result.results
        : [];

      return rawProducts.map((item: any) => ({
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
        product_images: item.image ? [item.image] : [],
        description: item.product?.description ?? '',
      }));
    },
    pageCountExtractor: (result: any) => {
      // Stock API: { status: "success", data: { total_pages: 2 } }
      // Stock-batches API: { total_pages: 5 }
      return result?.data?.total_pages || result?.total_pages || -1;
    },
  };

  const customActions = {
    handleEditRow: (row: ProductType) => {
      setEditItemId(row.id);
      setEditOpen(true);
    },
  };

  return {
    editOpen,
    setEditOpen,
    editItemId,
    setEditItemId,
    editLoading,
    handleUpdateProduct,
    tableConfig,
    customActions,
  };
}
