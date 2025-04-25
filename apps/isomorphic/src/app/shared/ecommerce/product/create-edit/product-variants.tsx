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
import { Controller, SubmitHandler } from 'react-hook-form';
import { useCreateProductVariant } from '@/hooks/products/productVariant/useCreateProductVariant';

interface VariantOption {
  value: string;
  label: string;
}

interface VariantValueOption {
  value: string;
  label: string;
  variantId: string;
}

export default function ProductVariants({ className }: { className?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedVariants, setAddedVariants] = useState<
    { id: string; name: string; value: string }[]
  >([]);
  const {
    mutate: createProductVariant,
    data: productVariantData,
    status: createStatus,
  } = useCreateProductVariant();
  const { data: variantsData } = useVariants();
  const { data: variantValuesData } = useVariantValue();

  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [valueOptions, setValueOptions] = useState<VariantValueOption[]>([]);

  const [addedVariantAttributes, setAddedVariantAttributes] = useState([
    { variantId: '', valueId: '' },
  ]);

  useEffect(() => {
    if (variantsData?.pages) {
      const options = variantsData.pages.flatMap((page) =>
        page.data.results.map((variant: any) => ({
          value: variant.id,
          label: variant.name,
        }))
      );
      setVariantOptions(options);
    }
  }, [variantsData]);

  useEffect(() => {
    if (variantValuesData?.pages) {
      const options = variantValuesData.pages.flatMap((page) =>
        page.data.results.map((value: any) => ({
          value: value.id,
          label: value.value,
          variantId: value.attribute,
        }))
      );
      setValueOptions(options);
    }
  }, [variantValuesData]);

  const addNewVariantAttribute = () => {
    setAddedVariantAttributes((prev) => [
      ...prev,
      { variantId: '', valueId: '' },
    ]);
  };

  const onSubmit: SubmitHandler<VariantFormInput> = (formData) => {
    console.log('Submitting:', formData);

    const formattedVariants = formData.variants.map(
      ({ variantId, valueId }) => ({
        variants: variantId,
        value: valueId,
      })
    );

    createProductVariant({
      variants: formattedVariants,
      price: parseFloat(formData.price),
      sku: formData.sku,
      stock: parseInt(formData.stock, 10),
    });
    setAddedVariantAttributes([{ variantId: '', valueId: '' }]);
    setIsModalOpen(false);
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

      <table className="w-full overflow-hidden rounded-md border border-gray-200 text-center text-sm shadow-sm">
        <thead className="bg-gray-50 font-semibold text-gray-700">
          <tr>
            <th className="border-b px-4 py-3">Variant Name</th>
            <th className="border-b px-4 py-3">Variant Value</th>
          </tr>
        </thead>
        <tbody>
          {addedVariants.map((item) => (
            <tr key={item.id} className="border-b bg-white even:bg-gray-50">
              <td className="px-4 py-3">{item.name}</td>
              <td className="px-4 py-3">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Form<VariantFormInput>
          validationSchema={variantSchema}
          onSubmit={onSubmit}
          useFormProps={{
            mode: 'onSubmit',
            resolver: zodResolver(variantSchema),
            defaultValues: {
              variants: addedVariantAttributes,
              price: '',
              sku: '',
            },
          }}
        >
          {({ register, control, watch, formState: { errors } }) => (
            <div className="space-y-5 p-4">
              <h2 className="text-lg font-bold">Add New Variant</h2>

              {addedVariantAttributes.map((_, index) => (
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
                          variantOptions.find((r) => r.value === selected)
                            ?.label ?? ''
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
                            opt.variantId ===
                            watch(`variants.${index}.variantId`)
                        )}
                        label="Variant Value"
                        className="w-full"
                        getOptionValue={(option) => option.value}
                        displayValue={(selected) =>
                          valueOptions.find((r) => r.value === selected)
                            ?.label ?? ''
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
                  <label className="text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    {...register('price')}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter SKU"
                    {...register('sku')}
                  />
                  {errors.sku && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.sku.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Stock
                  </label>
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
                <Button type="submit">Save Variant</Button>
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
}
