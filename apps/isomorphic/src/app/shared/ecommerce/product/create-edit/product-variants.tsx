'use client';

import { useEffect, useState } from 'react';
import { Input, Button, Select, Modal } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import FormGroup from '@/app/shared/form-group';
import useVariants from '@/hooks/products/variants/useVariants';
import useVariantValue from '@/hooks/products/variantValues/useVariantValue';
import ProductMultipleMedia from './product-multiple-media';
import { Form } from '@core/ui/form';
import {
  VariantFormInput,
  variantSchema,
} from '@/validators/create-variant-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useCreateProductVariant } from '@/hooks/products/productVariant/useCreateProductVariant';
import { useProductsById } from '@/hooks/products/useProductsById';

interface VariantOption {
  value: string;
  label: string;
}

interface VariantValueOption {
  value: string;
  label: string;
  variantId: string;
}

interface CreatedVariant {
  name: string;
  price: number;
  sku: string;
  value: string;
}

export default function ProductVariants({
  className,
  productId,
}: {
  className?: string;
  productId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [valueOptions, setValueOptions] = useState<VariantValueOption[]>([]);
  const [addedVariantAttributes, setAddedVariantAttributes] = useState([
    { variantId: '', valueId: '' },
  ]);

  const [createdVariants, setCreatedVariants] = useState<CreatedVariant[]>([]);

  const { mutate: createProductVariant, status: createStatus } =
    useCreateProductVariant();

  const { data: variantsData } = useVariants();
  const { data: variantValuesData } = useVariantValue();
  const { data: productVariant, isFetching } = useProductsById(productId);
  useEffect(() => {
    if (productVariant?.data?.variants) {
      setCreatedVariants(productVariant.data.variants);
    }
  });
  useEffect(() => {
    if (variantValuesData?.pages) {
      const options = variantValuesData.pages.flatMap(
        (page) =>
          page?.data?.results?.map((value: any) => ({
            value: value.id,
            label: value.value,
            variantId: value.attribute,
          })) ?? [] // fallback to empty array if results is undefined
      );
      setValueOptions(options);
    }
  }, [variantValuesData]);

  // useEffect(() => {
  //   if (variantValuesData?.pages) {
  //     const options = variantValuesData.pages.flatMap((page) =>
  //       page.data.results.map((value: any) => ({
  //         value: value.id,
  //         label: value.value,
  //         variantId: value.attribute,
  //       }))
  //     );
  //     setValueOptions(options);
  //   }
  // }, [variantValuesData]);

  const addNewVariantAttribute = () => {
    const currentVariants = getValues('variants');
    const newIndex = currentVariants.length;

    setValue(`variants.${newIndex}.variantId`, '');
    setValue(`variants.${newIndex}.valueId`, '');

    setAddedVariantAttributes((prev) => [
      ...prev,
      { variantId: '', valueId: '' },
    ]);
  };

  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VariantFormInput>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      variants: [{ variantId: '', valueId: '' }],
      price: 1,
      sku: '',
      stock: 1,
    },
  });

  const onSubmit: SubmitHandler<VariantFormInput> = (formData) => {
    createProductVariant(
      {
        product: productId,
        sku: formData.sku,
        price: formData.price,
        stock: formData.stock,
        // variants: formData.variants.map((v) => ({
        //   variantId: v.variantId,
        //   valueId: v.valueId,
        // })),
        attributes: formData.variants.map((v) => v.valueId),
      },
      {
        onSuccess: () => {
          // Collect all variant + value labels
          const variantPairs = formData.variants.map((v) => {
            const variantName =
              variantOptions.find((opt) => opt.value === v.variantId)?.label ??
              'Unknown';
            const valueName =
              valueOptions.find((opt) => opt.value === v.valueId)?.label ??
              'Unknown';
            return `${variantName}: ${valueName}`;
          });

          const combinedName = variantPairs.join(' / ');

          setCreatedVariants((prev) => [
            ...prev,
            {
              name: combinedName,
              value: '', // Not used anymore as name includes all
              price: formData.price,
              sku: formData.sku,
            },
          ]);
          setAddedVariantAttributes([{ variantId: '', valueId: '' }]);
          setIsModalOpen(false);
          reset();
        },
      }
    );
  };

  return (
    <>
      <FormGroup
        title="Variant Options"
        description="Add your product variants here"
        className={cn(className)}
      >
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          className="col-span-full ml-auto w-auto"
        >
          <PiPlusBold className="me-2 h-4 w-4" /> Add Variant
        </Button>
      </FormGroup>
      {createdVariants.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-base font-semibold">Created Variants</h3>
          <div className="overflow-x-auto rounded border">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Attributes
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Price
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    SKU
                  </th>
                </tr>
              </thead>
              <tbody>
                {createdVariants.map((v, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{v.name}</td>
                    <td className="px-4 py-2">${v.price}</td>
                    <td className="px-4 py-2">{v.sku}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-5 p-4">
          <h2 className="text-lg font-bold">Add New Variant</h2>
          {addedVariantAttributes.map((field, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <Controller
                control={control}
                name={`variants.${index}.variantId`}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={variantOptions}
                    label="Variant Name"
                    className="w-full"
                    getOptionValue={(option) => option.value}
                    displayValue={(selected) =>
                      variantOptions.find((r) => r.value === selected)?.label ??
                      ''
                    }
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              <Controller
                control={control}
                name={`variants.${index}.valueId`}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={valueOptions.filter(
                      (opt) =>
                        opt.variantId === watch(`variants.${index}.variantId`)
                    )}
                    label="Variant Value"
                    className="w-full"
                    getOptionValue={(option) => option.value}
                    displayValue={(selected) =>
                      valueOptions.find((r) => r.value === selected)?.label ??
                      ''
                    }
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addNewVariantAttribute}
                className="mt-6 text-sm"
              >
                <PiPlusBold className="h-6 w-4" />
              </Button>
              {errors.variants?.[index] && (
                <p className="col-span-3 text-sm text-red-500">
                  {errors.variants[index]?.variantId?.message ||
                    errors.variants[index]?.valueId?.message}
                </p>
              )}
            </div>
          ))}
          <ProductMultipleMedia />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Price</label>
              <Input
                type="number"
                placeholder="Enter price"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">SKU</label>
              <Input type="text" placeholder="Enter SKU" {...register('sku')} />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.sku.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Stock</label>
              <Input
                type="text"
                placeholder="Enter Stock"
                {...register('stock')}
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              isLoading={createStatus === 'pending'}
              onClick={(e) => {
                e.stopPropagation();
                handleSubmit(onSubmit)();
              }}
            >
              Save Variant
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
