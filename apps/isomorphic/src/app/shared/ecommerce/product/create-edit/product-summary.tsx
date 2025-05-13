'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Input, MultiSelect, Select, Textarea } from 'rizzui';
import cn from '@core/utils/class-names';
import FormGroup from '@/app/shared/form-group';
import {
  categoryOption,
  typeOption,
  materialOptions,
} from '@/app/shared/ecommerce/product/create-edit/form-utils';
import dynamic from 'next/dynamic';
import SelectLoader from '@core/components/loader/select-loader';
import QuillLoader from '@core/components/loader/quill-loader';
import usePaginatedCategories from '@/hooks/categories/usePaginatedCategories';
// const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
//   ssr: false,
//   loading: () => <SelectLoader />,
// });
const QuillEditor = dynamic(() => import('@core/ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[143px]" />,
});

export default function ProductSummary({ className }: { className?: string }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { data, isLoading } = usePaginatedCategories({
    pageIndex: 0,
    pageSize: 100,
  });

  const categoryOptions =
    data?.pages
      ?.flatMap((page: any) => page?.data?.results)
      ?.map((category: any) => ({
        label: category.name,
        value: category.id,
      })) || [];

  return (
    <FormGroup
      title="summary"
      description="Edit your product description and necessary information from here"
      className={cn(className)}
    >
      <Input
        label="Title"
        placeholder="Product title"
        {...register('title')}
        error={errors.title?.message as string}
      />
      <Input
        label="SKU"
        placeholder="Product sku"
        {...register('sku')}
        error={errors.sku?.message as string}
      />
      <Input
        type="number"
        label="Stock"
        placeholder="10"
        {...register('stock', { valueAsNumber: true })}
        error={errors.stock?.message as string}
      />

      <Controller
        control={control}
        name="category"
        render={({ field }) => {
          const selectedOption = categoryOptions.find(
            (opt) => opt.value === field.value
          );

          return (
            <Select
              label="Categories"
              placeholder="Select a category"
              options={categoryOptions}
              value={selectedOption ?? null}
              onChange={(option: { label: string; value: number }) =>
                field.onChange(option?.value)
              }
              // isLoading={isLoading}
              error={errors.category?.message as string}
            />
          );
        }}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <QuillEditor
            value={value}
            onChange={onChange}
            label="Product Details"
            className="col-span-full [&_.ql-editor]:min-h-[100px]"
            labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
            error={errors?.description?.message as string}
          />
        )}
      />
    </FormGroup>
  );
}
