'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Element } from 'react-scroll';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Text } from 'rizzui';
import cn from '@core/utils/class-names';
import FormNav, {
  formParts,
} from '@/app/shared/ecommerce/product/create-edit/form-nav';
import ProductSummary from '@/app/shared/ecommerce/product/create-edit/product-summary';
import { defaultValues } from '@/app/shared/ecommerce/product/create-edit/form-utils';
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
import { productsDataType } from '@/data/products-data';
import { useUpdateProducts } from '@/hooks/products/useUpdateProducts';
import { useProductsById } from '@/hooks/products/useProductsById';
import { Form } from '@core/ui/form';
import ProductVariants from './product-variants';
import ProductSpecification from './product-specification';
const MAP_STEP_TO_COMPONENT = {
  [formParts.summary]: ProductSummary,
  [formParts.media]: ProductMedia,
  [formParts.pricingInventory]: PricingInventory,
  // [formParts.productIdentifiers]: ProductIdentifiers,
  [formParts.shipping]: ShippingInfo,
  // [formParts.seo]: ProductSeo,
  // [formParts.deliveryEvent]: DeliveryEvent,
  [formParts.variantOptions]: ProductVariants,
  [formParts.productSpecifications]: ProductSpecification,
  // [formParts.tagsAndCategory]: ProductTaxonomies,
  [formParts.similiarProducts]: similiarProducts,
};

interface IndexProps {
  slug?: string;
  className?: string;
  product?: CreateProductInput;
  productId?: string;
}

export default function CreateEditProduct({
  slug,
  product,
  className,
  productId,
}: IndexProps) {
  const { layout } = useLayout();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const { data, isFetching, status } = useProductsById(productId);
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
    defaultValues: product || {},
  });
  useEffect(() => {
    console.log('dataiiiiiiiiiiiiiii', data);

    if (data?.status === 'success') {
      Object.entries(data.data).forEach(([key, value]) => {
        form.setValue(key as keyof CreateProductInput, value as string);
      });
    }
  }, [data]);
  const onSubmit: SubmitHandler<CreateProductInput> = (formData) => {
    console.log('formDataproduct-----', formData);
    setLoading(true);

    const productData: productsDataType = {
      id: productId || '',
      name: formData.name || '',
      // images: formData.images?.[0]?.url || null,
      sku: formData.sku || '',
      price: formData.price || 0,
      category: formData.category || '',
      description: formData.description || '',
    };
    if (productId) {
      updateProducts(productData);
    } else {
      createProducts(productData);
    }
  };

  useEffect(() => {
    if (createStatus === 'pending' || updateStatus === 'pending') return;

    if (
      (createStatus === 'success' && productData) ||
      (updateStatus === 'success' && updateResponseData)
    ) {
      toast.success(
        productId
          ? 'product updated successfully'
          : 'product created successfully'
      );
      setReset({
        id: '',
        name: '',
        image: null,
        sku: '',
        price: '',
        catagoryName: '',
      });

      setLoading(false);
    } else if (createStatus === 'error' || updateStatus === 'error') {
      toast.error('Product creation failed');

      setLoading(false);
    }
  }, [createStatus, updateStatus]);

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
            {Object.entries(MAP_STEP_TO_COMPONENT).map(([key, Component]) => (
              <Element
                key={key}
                name={formParts[key as keyof typeof formParts]}
              >
                {
                  <Component
                    className="pt-7 @2xl:pt-9 @3xl:pt-11"
                    productId={''}
                  />
                }
              </Element>
            ))}
          </div>

          <FormFooter
            isLoading={isLoading}
            submitBtnText={slug ? 'Update Product' : 'Create Product'}
          />
        </form>
      </FormProvider>
    </div>
  );
}
