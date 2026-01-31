'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { log } from 'console';
import { useRouter } from 'next/navigation';
import router from 'next/navigation';

type ProductVariantItem = {
  id: string;
  sku: string;
  image: string;
  product: {
    name: string;
    price: string;
    sku: string;
  };
};

type ProductItemsResponse = {
  status: string;
  message: string;
  data: ProductVariantItem[];
};

const addStockSchema = z.object({
  product_variant: z.string().min(1, 'Please select a product'),
  quantity: z.coerce
    .number({ invalid_type_error: 'Quantity must be a number' })
    .min(1, 'Quantity must be greater than 0')
    .max(10_000_000_000, 'Price cannot exceed 10 digits'),
});

type AddStockFormValues = z.infer<typeof addStockSchema>;

export default function AddStockPopup() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  const [productItems, setProductItems] = useState<ProductVariantItem[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddStockFormValues>({
    resolver: zodResolver(addStockSchema),
    defaultValues: {
      product_variant: '',
      quantity: undefined,
    },
  });

  const selectedVariantId = watch('product_variant');

  useEffect(() => {
    if (open) setTimeout(() => setAnimate(true), 10);
    else {
      setAnimate(false);
    }
  }, [open]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      setOpen(false);
      reset();
      setSearchTerm('');
    }, 200);
  };

  useEffect(() => {
    if (!open) return;

    const fetchProductItems = async () => {
      try {
        setProductsLoading(true);

        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
          toast('Access token missing');
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/product-items/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) {
          console.log('Product items API error:', res.status);
          return;
        }

        const json: ProductItemsResponse = (await res.json()) as any;
        setProductItems(Array.isArray(json?.data) ? json.data : []);
      } catch (err) {
        console.log('Fetch product items error:', err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProductItems();
  }, [open]);

  const onSubmit: SubmitHandler<AddStockFormValues> = async (data) => {
    try {
      setLoading(true);

      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        toast('Access token missing');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/stocks/bulk/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            quantity: data.quantity,
            product_variant: data.product_variant,
          }),
        }
      );

      const result = (await res.json().catch(() => null)) as any;

      if (!res.ok) {
        toast(result?.message || 'Stock create failed');
        return;
      }
      console.log(result);
      toast(result ? `Stock added successfully` : '');
      handleClose();
      router.refresh();
    } catch (error) {
      console.log('Create Stock Error:', error);
      toast('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-200';

  const errorInputClass = 'border-red-500 ring-1 ring-red-200';

  const labelClass = ' text-sm font-medium text-gray-700 mb-1';

  const selectedProduct = productItems.find((p) => p.id === selectedVariantId);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-secondary1 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-pink-600"
      >
        + Add Stock
      </button>

      {open && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 transition-opacity duration-200 ${
            animate ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        >
          <div
            className={`w-full max-w-[600px] transform rounded-2xl bg-white shadow-xl transition-all duration-200 ${
              animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Stock Quantity
                </h2>
                <p className="text-sm text-gray-500">
                  Select product variant and enter quantity.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5 px-6 py-5">
                <div>
                  <label className={labelClass}>Select Product Variant</label>
                  {productsLoading ? (
                    <div className="text-sm text-gray-500">
                      Loading products...
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        className={`${inputClass} ${errors.product_variant ? errorInputClass : ''}`}
                        placeholder="Search product..."
                        value={
                          selectedVariantId && !searchTerm
                            ? productItems.find(
                                (p) => p.id === selectedVariantId
                              )?.product?.name || ''
                            : searchTerm
                        }
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setSearchOpen(true);
                          if (selectedVariantId) {
                            setValue('product_variant', ''); // Clear form selection if user types
                          }
                        }}
                        onFocus={() => {
                          setSearchOpen(true);
                        }}
                      />

                      {errors.product_variant && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.product_variant.message}
                        </p>
                      )}

                      {searchOpen && (
                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {productItems
                            .filter(
                              (item) =>
                                (item.product?.name || '')
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                (item.sku || '')
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                            )
                            .map((item) => (
                              <div
                                key={item.id}
                                className="cursor-pointer px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                                onClick={() => {
                                  setValue('product_variant', item.id, {
                                    shouldValidate: true,
                                  });
                                  setSearchTerm(''); // Clear search term so we can show selected name or keep it?
                                  // Ideally show name.
                                  // But input value logic above handles it: if ID exists & no new search term
                                  setSearchOpen(false);
                                }}
                              >
                                <div className="font-medium">
                                  {item.product?.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  SKU: {item.sku} | Price: {item.product?.price}
                                </div>
                              </div>
                            ))}
                          {productItems.filter((item) =>
                            (item.product?.name || '')
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          ).length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-500">
                              No products found
                            </div>
                          )}
                        </div>
                      )}

                      {searchOpen && (
                        <div
                          className="fixed inset-0 z-0"
                          onClick={() => setSearchOpen(false)}
                        ></div>
                      )}
                    </div>
                  )}

                  {selectedProduct && (
                    <div className="mt-3 rounded-lg border bg-gray-50 p-3 text-sm">
                      <div className="font-medium text-gray-800">
                        {selectedProduct.product?.name}
                      </div>
                      <div className="text-gray-600">
                        Variant SKU: {selectedProduct.sku}
                      </div>
                      <div className="text-gray-600">
                        Price: {selectedProduct.product?.price}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Quantity</label>
                  <input
                    type="number"
                    {...register('quantity')}
                    className={`${inputClass} ${errors.quantity ? errorInputClass : ''}`}
                    placeholder="Enter Quantity (example : 1 )"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 border-t px-6 py-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleClose}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || productsLoading}
                  className="flex-1 rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-pink-600 disabled:opacity-60"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
