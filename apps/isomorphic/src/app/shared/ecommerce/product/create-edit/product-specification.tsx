'use client';

import { useEffect, useState } from 'react';
import { Input, Button, Select, Modal, Tooltip, ActionIcon } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import FormGroup from '@/app/shared/form-group';
import {
  ProductSpecificationFormInput,
  SpecificationSchema,
} from '@/validators/product-specification-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useCreateSpecificationValue } from '@/hooks/products/specificationValues/useCreateSpecificationValue';
import useSpecifications from '@/hooks/products/specifications/useSpecifications';
import { useProductsById } from '@/hooks/products/useProductsById';
import { useSpecificationValueById } from '@/hooks/products/specificationValues/useSpecificationValueById';
import { useDeleteSpecificationValue } from '@/hooks/products/specificationValues/useDeleteSpecificationValue';
import { useUpdateSpecificationValue } from '@/hooks/products/specificationValues/useUpdateSpecificationValue';
import DeletePopover from '@core/components/delete-popover';
import PencilIcon from '@core/components/icons/pencil';

interface Specification {
  id?: string;
  name?: string;
  specification?: string;
  product?: string;
  value?: string;
}

interface SpecificationValue {
  id?: string;
  specification: string;
  product?: string;
  value: string;
  name?: string;
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

  const [selectedSpecification, setSelectedSpecification] = useState<
    string | null
  >(null);
  const [specificationAction, setSpecificationAction] = useState<string | null>(
    null
  );

  const { data: specificationValueById } = useSpecificationValueById(
    specificationAction === 'edit' && selectedSpecification
  );
  const { mutate: deleteSpecificationValue, status: deleteStatus } =
    useDeleteSpecificationValue();
  const { mutate: updateSpecificationValue, status: updateStatus } =
    useUpdateSpecificationValue();

  const {
    mutate: createProductSpecificationValue,
    data: specificationValueData,
    status: createStatus,
  } = useCreateSpecificationValue();
  const { data: specificationsData } = useSpecifications();
  const { data: productSpecification, isFetching } = useProductsById(productId);

  useEffect(() => {
    // Set specifications from product data when loaded
    if (productSpecification?.data?.specifications) {
      setSpecifications(productSpecification.data.specifications);
    }
  }, [productSpecification]);

  useEffect(() => {
    if (specificationValueById?.data && selectedSpecification) {
      const specificationValue = specificationValueById.data;

      setValue('id', specificationValue?.id);
      setValue('specification', specificationValue?.specification);
      setValue('value', specificationValue?.value);

      setIsModalOpen(true);
    }
  }, [specificationValueById, selectedSpecification]);

  useEffect(() => {
    if (!specificationsData?.data) return;

    const options = specificationsData.data.map((spec: Specification) => ({
      value: spec.id,
      label: spec.name,
    }));

    setSpecificationOptions(options);
  }, [specificationsData]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductSpecificationFormInput>({
    resolver: zodResolver(SpecificationSchema),
    defaultValues: {
      specification: '',
      value: '',
    },
  });
  const onSubmit: SubmitHandler<ProductSpecificationFormInput> = (formData) => {
    if (formData?.id) {
      updateSpecificationValue(
        {
          id: formData.id,
          specification: formData.specification,
          value: formData.value,
          product: productId,
        },
        {
          onSuccess: ({ data }: any) => {
            const result = data;
            const newSpecification = {
              id: result.id,
              specification: result.specification,
              name: result.specification_data?.name,
              value: result.value,
            };
            setSpecifications((prev) =>
              prev.map((v) => (v.id === result.id ? newSpecification : v))
            );
            setSelectedSpecification(null);
            setIsModalOpen(false);
          },
        }
      );
    } else {
      createProductSpecificationValue(
        {
          specification: formData.specification,
          value: formData.value,
          product: productId,
        },
        {
          onSuccess: ({ data }: any) => {
            const result = data;
            const newSpecification = {
              id: result.id,
              specification: result.specification,
              name: result.specification_data?.name,
              value: result.value,
            };
            setSpecifications((prev) => [...prev, newSpecification]);
            setSelectedSpecification(null);
            setIsModalOpen(false);
          },
        }
      );
    }
  };

  const handleDeleteSpecification = (id: string) => {
    setSpecificationAction('delete');
    setSelectedSpecification(id);
    deleteSpecificationValue(id, {
      onSuccess: () => {
        setSpecifications((prev) => prev.filter((v) => v.id !== id));
        setSpecificationAction(null);
        setSelectedSpecification(null);
      },
    });
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
          <div className="mt-6">
            <div className="overflow-x-auto rounded border">
              <table className="w-full divide-y divide-gray-200 overflow-hidden text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">
                      Specification
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">
                      Value
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {specifications.map((spec, index) => (
                    <tr
                      key={index}
                      className="border-b bg-white even:bg-gray-50"
                    >
                      <td className="px-4 py-3">{spec.name}</td>

                      <td className="px-4 py-3">{spec.value}</td>
                      <td className="space-x-2">
                        <Tooltip
                          size="sm"
                          content="Edit Variant"
                          placement="top"
                          color="invert"
                        >
                          <ActionIcon
                            as="span"
                            size="sm"
                            variant="outline"
                            aria-label="Edit Variant"
                            isLoading={
                              isFetching && selectedSpecification === spec.id
                            }
                            onClick={() => {
                              setSpecificationAction('edit');
                              setSelectedSpecification(spec.id as string);
                            }}
                          >
                            <PencilIcon className="size-4" />
                          </ActionIcon>
                        </Tooltip>
                        <DeletePopover
                          title="Delete Variant"
                          description="Are you sure you want to delete this variant? This action cannot be undone."
                          onDelete={() =>
                            handleDeleteSpecification(spec.id as string)
                          }
                          isLoading={
                            deleteStatus === 'pending' &&
                            selectedSpecification === spec.id
                          }
                          className="z-20"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </FormGroup>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedSpecification(null);
          setSpecificationAction(null);
          setIsModalOpen(false);
        }}
      >
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
                onClick={() => {
                  setSelectedSpecification(null);
                  setSpecificationAction(null);
                  setIsModalOpen(false);
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                isLoading={
                  createStatus === 'pending' || updateStatus === 'pending'
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit(onSubmit)();
                }}
              >
                {specificationAction === 'edit' ? 'Update ' : 'Save '}
                Specification
              </Button>
            </div>
          </div>
        </>
      </Modal>
    </>
  );
}
