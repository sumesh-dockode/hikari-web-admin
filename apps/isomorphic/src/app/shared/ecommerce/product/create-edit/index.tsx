'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Element } from 'react-scroll';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import cn from '@core/utils/class-names';
import FormNav, {
  formParts,
} from '@/app/shared/ecommerce/product/create-edit/form-nav';
import ProductSummary from '@/app/shared/ecommerce/product/create-edit/product-summary';
import ProductMedia from '@/app/shared/ecommerce/product/create-edit/product-media';
import PricingInventory from '@/app/shared/ecommerce/product/create-edit/pricing-inventory';
import ShippingInfo from '@/app/shared/ecommerce/product/create-edit/shipping-info';
import similiarProducts from '@/app/shared/ecommerce/product/create-edit/similiar-products';
import FormFooter from '@core/components/form-footer';
import {
  CreateProductInput,
  productFormSchema,
} from '@/validators/create-product.schema';
import { useLayout } from '@/layouts/use-layout';
import { LAYOUT_OPTIONS } from '@/config/enums';
import { useCreateProducts } from '@/hooks/products/useCreateProducts';
import { useUpdateProducts } from '@/hooks/products/useUpdateProducts';
import { useProductsById } from '@/hooks/products/useProductsById';
import { productsDataType } from '@/data/products-data';

import ProductSpecification from './product-specification';
import { useRouter } from 'next/navigation';
import ProductVariants from './product-variants';
import PageLoader from '@/app/shared/page-loader';

const MAP_STEP_TO_COMPONENT = {
  [formParts.summary]: ProductSummary,
  // [formParts.media]: ProductMedia,
  [formParts.pricingInventory]: PricingInventory,
  [formParts.shipping]: ShippingInfo,
  [formParts.variantOptions]: ProductVariants,
  [formParts.productSpecifications]: ProductSpecification,
  [formParts.similiarProducts]: similiarProducts,
};

interface IndexProps {
  slug?: string;
  className?: string;
  product?: CreateProductInput;
}

export default function CreateEditProduct({
  slug,
  product,
  className,
}: IndexProps) {
  const { layout } = useLayout();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [productId, setProductId] = useState<string | undefined>(slug);

  const { data, isFetching } = useProductsById(productId);

  const {
    mutate: createProducts,
    data: productData,
    status: createStatus,
  } = useCreateProducts();
  const {
    mutate: updateProducts,
    data: updateResponseData,
    status: updateStatus,
  } = useUpdateProducts();

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      sku: '',
      price: '',
      category: '',
      stock: 0,
      description: '',
      is_next_day_shipping_available: false,
      similar_products: [],
      ...product,
    },
  });

  const router = useRouter();
  // Populate form if editing an existing product
  useEffect(() => {
    if (data?.status === 'success') {
      form.reset({
        id: data.data.id || '',
        title: data.data.name || '',
        sku: data.data.sku || '',
        price: data.data.price || 0,
        stock: data.data.stock || 0,
        category: data.data.category || '',
        description: data.data.description || '',
        similar_products: data.data.similar_products || [],
        is_next_day_shipping_available:
          data.data.is_next_day_shipping_available || false,
      });
    }
  }, [data]);

  const onSubmit: SubmitHandler<CreateProductInput> = (formData) => {
    setLoading(true);

    const basePayload = {
      name: formData.title,
      sku: formData.sku,
      price: formData.price,
      stock: formData.stock,
      category: formData.category,
      description: formData.description,
      similar_products: formData.similar_products,
      is_next_day_shipping_available: formData.is_next_day_shipping_available,
    };
    if (productId) {
      const productPayload: productsDataType = {
        id: productId,
        ...basePayload,
      };
      updateProducts(productPayload, {
        onSuccess: (response) => {
          if (response?.id) {
            setLoading(false);
            setReset({
              id: '',
              name: '',
              image: null,
              sku: '',
              price: 0,
              catagoryName: '',
              description: '',
              similar_products: [],
              is_next_day_shipping_available: false,
              stock: 0,
            });
            toast.success('Product updated successfully');
            router.push(`/products`);
          }
        },
        onError: () => {
          toast.error('Product updation failed');
          setLoading(false);
        },
      });
    } else {
      createProducts(basePayload as productsDataType, {
        onSuccess: (response) => {
          if (response?.id) {
            setLoading(false);
            setProductId(response.id);
            toast.success('Product created successfully');
            // router.push(`/products/${response.id}/edit`);
          }
        },
        onError: () => {
          toast.error('Product creation failed');
          setLoading(false);
        },
      });
    }
  };

  if (isFetching) return <PageLoader />;

  return (
    <div className="@container">
      <FormNav
        className={cn(
          layout === LAYOUT_OPTIONS.BERYLLIUM && 'z-[999] 2xl:top-[72px]'
        )}
      />
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            'relative z-[19] [&_label.block>span]:font-medium',
            className
          )}
        >
          <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
            {Object.entries(MAP_STEP_TO_COMPONENT)
              .filter(([key]) => {
                const isSpecOrVariant =
                  key === formParts.variantOptions ||
                  key === formParts.productSpecifications;

                // Filter out spec/variant components if product hasn't been created
                if (!productId && isSpecOrVariant) {
                  return false;
                }

                return true;
              })
              .map(([key, Component]) => (
                <Element
                  key={key}
                  name={formParts[key as keyof typeof formParts]}
                >
                  <Component
                    className="pt-7 @2xl:pt-9 @3xl:pt-11"
                    productId={productId || ''}
                  />
                </Element>
              ))}
          </div>

          <FormFooter
            isLoading={isLoading}
            submitBtnText={productId ? 'Update Product' : 'Create Product'}
          />
        </form>
      </FormProvider>
    </div>
  );
}
