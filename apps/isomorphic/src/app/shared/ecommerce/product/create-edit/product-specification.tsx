'use client';

import { useEffect, useState } from 'react';
import { Input, Button, Select, Modal } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import FormGroup from '@/app/shared/form-group';
import { Form } from '@core/ui/form';
import {
  ProductSpecificationFormInput,
  SpecificationSchema,
} from '@/validators/product-specification-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useCreateSpecificationValue } from '@/hooks/products/specificationValues/useCreateSpecificationValue';
import useSpecifications from '@/hooks/products/specifications/useSpecifications';
import { useProductsById } from '@/hooks/products/useProductsById';

interface Specification {
  id?: string;
  name?: string;
  specification?: string;
  product?: string;
  value?: string;
}

interface SpecificationValue {
  specification: string;
  product: string;
  value: string;
}

export default function ProductSpecifications({
  className,
  productId,
}: {
  className?: string;
  productId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [specifications, setSpecifications] = useState<SpecificationValue[]>(
    []
  );
  const [specificationOptions, setSpecificationOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const {
    mutate: createProductSpecificationValue,
    data: specificationValueData,
    status: createStatus,
  } = useCreateSpecificationValue();
  const { data: specificationsData } = useSpecifications();
  const { data: productSpecification, isFetching } = useProductsById(productId);
  console.log('specificationsData-------------', specificationsData);
  console.log('productSpecification0000000', productSpecification);

  useEffect(() => {
    // Set specifications from product data when loaded
    if (productSpecification?.data?.specifications) {
      setSpecifications(productSpecification.data.specifications);
    }
  }, [productSpecification]);
  useEffect(() => {
    if (!specificationsData?.pages) return;

    const options = specificationsData.pages.flatMap(
      (page) =>
        page?.data?.results?.map((spec: Specification) => ({
          value: spec.id,
          label: spec.name,
        })) ?? []
    );

    setSpecificationOptions(options);
  }, [specificationsData]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductSpecificationFormInput>({
    resolver: zodResolver(SpecificationSchema),
    defaultValues: {
      specification: '',
      value: '',
    },
  });
  console.log('errors', errors);
  const onSubmit: SubmitHandler<ProductSpecificationFormInput> = (formData) => {
    console.log('Form submitted with:', formData);
    const selectedSpec = specificationOptions.find(
      (opt) => opt.value === formData.specification
    );

    const newSpecification = {
      specification: formData.specification,
      product: selectedSpec?.label || '',
      value: formData.value,
    };

    createProductSpecificationValue(
      {
        specification: formData.specification,
        value: formData.value,
        product: productId,
      },
      {
        onSuccess: () => {
          setSpecifications((prev) => [...prev, newSpecification]);
          setIsModalOpen(false);
        },
      }
    );
  };

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <FormGroup
        title="Product Specifications"
        description="Add your product specifications here"
        className={cn(className)}
      >
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          className="col-span-full ml-auto w-auto"
        >
          <PiPlusBold className="me-2 h-4 w-4" /> Add Specification
        </Button>

        {specifications.length > 0 && (
          <table className="mt-4 w-full overflow-hidden rounded-md border border-gray-200 text-left text-sm shadow-sm">
            <thead className="bg-gray-50 font-semibold text-gray-700">
              <tr>
                <th className="border-b px-4 py-3">Specification</th>
                <th className="border-b px-4 py-3">Value</th>
                {/* <th className="border-b px-4 py-3">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {specifications.map((spec, index) => (
                <tr key={index} className="border-b bg-white even:bg-gray-50">
                  <td className="px-4 py-3">
                    {specificationOptions.find(
                      (opt) => opt.value === spec.specification
                    )?.label ?? spec.specification}
                  </td>

                  <td className="px-4 py-3">{spec.value}</td>
                  {/* <td className="px-4 py-3">
                    <Button
                      variant="text"
                      onClick={() => removeSpecification(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash className="h-4 w-4" />
                    </Button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </FormGroup>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* <Form<ProductSpecificationFormInput>
          validationSchema={SpecificationSchema}
          onSubmit={onSubmit}
          useFormProps={{
            mode: 'onSubmit',
            resolver: zodResolver(SpecificationSchema),
            defaultValues: {
              specification: '',
              value: '',
            },
          }}
        > */}
        <>
          <div className="space-y-5 p-4">
            <h2 className="text-lg font-bold">Add New Specification</h2>

            <div className="grid gap-4">
              <Controller
                name="specification"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={specificationOptions}
                    label="Specification Name"
                    className="w-full"
                    error={errors.specification?.message}
                    getOptionValue={(option) => option.value}
                    displayValue={(selected) =>
                      specificationOptions.find((r) => r.value === selected)
                        ?.label ?? ''
                    }
                    onChange={(selectedValue) => field.onChange(selectedValue)}
                    value={field.value}
                  />
                )}
              />

              <Input
                label="Value"
                placeholder="Enter specification value"
                {...register('value')}
                error={errors.value?.message}
              />
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
                type="submit"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit(onSubmit)();
                }}
              >
                Save Specification
              </Button>
            </div>
          </div>
        </>
        {/* </Form> */}
      </Modal>
    </>
  );
}
