'use client';

import { useEffect, useState } from 'react';
import { Input, Button, Select, Modal, Tooltip, ActionIcon } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import FormGroup from '@/app/shared/form-group';
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
import { z } from 'zod';
import toast from 'react-hot-toast';


interface Specification {
  id?: string;
  name?: string;
  specification?: string;
  product?: string;
  value?: string;
}

interface SpecificationValue {
  id?: string;
  specification?: string;
  product?: string;
  value?: string;
  name?: string;
}

export const SpecificationValueSchema = z.object({
  id: z.string().optional(),
  value: z.string().min(1, 'Value is required'),
  product: z.string().min(1, 'Product is required'),
  specification: z.string().min(1, 'Specification is required'),
});

export type ProductSpecificationFormInput = z.infer<
  typeof SpecificationValueSchema
>;

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
      ? selectedSpecification
      : ''
  );
  const { mutate: deleteSpecificationValue, status: deleteStatus } =
    useDeleteSpecificationValue();
  const { mutate: updateSpecificationValue, status: updateStatus } =
    useUpdateSpecificationValue();
  const { mutate: createProductSpecificationValue, status: createStatus } =
    useCreateSpecificationValue();
  const { data: specificationsData } = useSpecifications();
  const { data: productSpecification, isFetching } = useProductsById(productId);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductSpecificationFormInput>({
    resolver: zodResolver(SpecificationValueSchema),
    defaultValues: {
      specification: '',
      value: '',
      product: productId,
    },
  });

  useEffect(() => {
    if (productSpecification?.data?.specifications) {
      setSpecifications(productSpecification.data.specifications);
    }
  }, [productSpecification]);

  // useEffect(() => {
  //   if (specificationValueById?.data && selectedSpecification) {
  //     const specificationValue = specificationValueById.data;
  //     reset({
  //       id: specificationValue?.id,
  //       specification: specificationValue?.specification,
  //       value: specificationValue?.value,
  //       product: productId,
  //     });
  //   }
  // }, [specificationValueById, selectedSpecification, productId, reset]);
  
  useEffect(() => {
  if (specificationValueById?.data && selectedSpecification) {
    const specificationValue = specificationValueById.data;
    setValue('id', specificationValue?.id);
    setValue('specification', specificationValue?.specification);
    setValue('value', specificationValue?.value);
    setValue('product', productId);
    
    // Open modal when data is loaded
    if (specificationAction === 'edit') {
      setIsModalOpen(true);
    }
  }
}, [specificationValueById, selectedSpecification, productId, setValue, specificationAction]);



  //edit
  const handleEditSpecification = (id: string) => {
  setSpecificationAction('edit');
  setSelectedSpecification(id);
  // Modal will be opened by the useEffect when data is loaded
};

  useEffect(() => {
    if (!specificationsData?.data) return;

    const options = specificationsData.data.map((spec: Specification) => ({
      value: spec.id || '',
      label: spec.name || '',
    }));

    setSpecificationOptions(options);
  }, [specificationsData]);

  const openModal = () => {
    reset({
      specification: '',
      value: '',
      product: productId,
      id: undefined,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSpecification(null);
    setSpecificationAction(null);
    setIsModalOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<ProductSpecificationFormInput> = (formData) => {
    if (!formData.specification || !formData.value) {
      return;
    }

    const payload = {
      specification: formData.specification,
      value: formData.value,
      product: productId,
    };

    if (formData.id) {
      updateSpecificationValue(
        {
          id: formData.id,
          ...payload,
        },
        {
          onSuccess: ({ data }: any) => {
            const newSpecification = {
              id: data.id,
              specification: data.specification,
              name: data.specification_data?.name,
              value: data.value,
            };
            setSpecifications((prev) =>
              prev.map((v) => (v.id === data.id ? newSpecification : v))
            );
             toast.success('Specification updated successfully');
            closeModal();
          },
        }
      );
    } else {
      createProductSpecificationValue(payload, {
        onSuccess: ({ data }: any) => {
          const newSpecification = {
            id: data.id,
            specification: data.specification,
            name: data.specification_data?.name,
            value: data.value,
          };
          setSpecifications((prev) => [...prev, newSpecification]);
           toast.success('Specification added successfully');
          closeModal();
        },
      });
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
        className={cn(className, 'space-y-6')}
      >
        <Button
          onClick={openModal}
          variant="outline"
          className="col-span-full ml-auto w-auto"
        >
          <PiPlusBold className="me-2 h-4 w-4" /> Add Specification
        </Button>
      </FormGroup>
      {specifications.length > 0 && (
        <div className="overflow-x-auto rounded border">
          <table className="w-full divide-y divide-gray-200 overflow-hidden text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-600">
                  Specification
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">
                  Value
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {specifications.map((spec, index) => (
                <tr key={index} className="border-b bg-white even:bg-gray-50">
                  <td className="px-6 py-4">{spec.name}</td>

                  <td className="px-6 py-4">{spec.value}</td>
                  <td className="space-x-2">
                    <Tooltip
                      size="sm"
                      content="Edit Variant"
                      placement="top"
                      color="invert"
                    >
                      {/* <ActionIcon
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
                      </ActionIcon> */}
                      <ActionIcon
                        as="span"
                        size="sm"
                        variant="outline"
                        aria-label="Edit Variant"
                        isLoading={isFetching && selectedSpecification === spec.id}
                        onClick={() => handleEditSpecification(spec.id as string)}
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
      )}

      {/* <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="space-y-5 p-4">
          <h2 className="text-lg font-bold">
            {specificationAction === 'edit' ? 'Edit' : 'Add New'} Specification
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
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
              <Button variant="outline" onClick={closeModal} type="button">
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={
                  createStatus === 'pending' || updateStatus === 'pending'
                }
              >
                {specificationAction === 'edit' ? 'Update' : 'Save'}{' '}
                Specification
              </Button>
            </div>
          </form>
        </div>
      </Modal> */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="space-y-5 p-4">
          <h2 className="text-lg font-bold">
            {specificationAction === 'edit' ? 'Edit' : 'Add New'} Specification
          </h2>

          {/* Rplc form with  div */}
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
                    specificationOptions.find((r) => r.value === selected)?.label ?? ''
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
            <Button variant="outline" onClick={closeModal} type="button">
              Cancel
            </Button>
            <Button
              type="button" 
              onClick={handleSubmit(onSubmit)} 
              isLoading={createStatus === 'pending' || updateStatus === 'pending'}
            >
              {specificationAction === 'edit' ? 'Update' : 'Save'} Specification
            </Button>
          </div>
        </div>
      </Modal>

    </>
  );
}
