'use client';

import { useState } from 'react';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import { Button } from 'rizzui/button';
import { PiPlusBold } from 'react-icons/pi';
import { Modal } from '@core/modal-views/modal';
import { Input } from 'rizzui/input';
import useVariants from '@/hooks/products/variants/useVariants';
import { useCreateVariants } from '@/hooks/products/variants/useCreatevariant';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@core/ui/form';
import {
  ProductVariantFormInput,
  ProductVariantValueFormInput,
  variantSchema,
  variantValueSchema,
} from '@/validators/product-variant.schema';
import { useQueryClient } from '@tanstack/react-query';
import TrashIcon from '@core/components/icons/trash';
import { Tooltip } from 'rizzui/tooltip';
import { ActionIcon } from 'rizzui/action-icon';
import Link from 'next/link';
import PencilIcon from '@core/components/icons/pencil';
import DeletePopover from '@core/components/delete-popover';
import { useUpdateVariant } from '@/hooks/products/variants/useUpdateVariant';
import { useVariantsById } from '@/hooks/products/variants/useVariantsById';
import useVariantValue from '@/hooks/products/variantValues/useVariantValue';
import { useDeleteVariants } from '@/hooks/products/variants/useDeleteVariants';
import { useCreateVariantsValues } from '@/hooks/products/variantValues/useCreateVariantValue';
import { useDeleteVariantsValue } from '@/hooks/products/variantValues/useDeleteVariantValue';
import { useUpdateVariantValue } from '@/hooks/products/variantValues/useUpdateVariantValue';

const pageHeader = {
  title: 'Product Variants',
  breadcrumb: [
    { href: routes.eCommerce.dashboard, name: 'Home' },
    { href: routes.eCommerce.productVariants, name: 'Variants' },
    { name: 'List' },
  ],
};

const COLORS = [
  '#FF0000',
  '#00AEEF',
  '#00FF00',
  '#FFA500',
  '#800080',
  '#000000',
];

export default function ProductVariantsPage({ variantId }: { variantId: any }) {
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVariants();
  const {
    data: variantValuesData,
    isLoading: isVariantValuesLoading,
    isError: isVariantValuesError,
  } = useVariantValue();
  const {
    mutate: createVariantValue,
    data: variantsValueData,
    status: createsStatus,
  } = useCreateVariantsValues();
  const {
    mutate: updateVariantValue,
    data: updateValueResponseData,
    status: updateValueStatus,
  } = useUpdateVariantValue();
  const { isLoading: isFetching } = useVariantsById(variantId || '');
  const {
    mutate: createVariants,
    data: variantData,
    status: createStatus,
  } = useCreateVariants();

  const {
    mutate: updateVariant,
    data: updateResponseData,
    status: updateStatus,
  } = useUpdateVariant();
  const { mutate: deleteVariant, status: deleteStatus } = useDeleteVariants();

  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [editingValue, setEditingValue] = useState<any>(null);
  const [isValueEditMode, setIsValueEditMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<any | null>(null);
  const variantsAPIData =
    data?.pages?.flatMap((page: any) => page?.data?.results) || [];

  const variantvalueAPIData =
    variantValuesData?.pages?.flatMap((page: any) => page?.data?.results) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [variantName, setVariantName] = useState('');
  const [variants, setVariants] = useState<
    { id: null; name: string; values: string[] }[]
  >([]);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedVariantType, setSelectedVariantType] =
    useState<string>('Color');
  const handleDeleteClick = (variantId: string) => {
    setVariantToDelete(variantId);
    setDeleteConfirmationOpen(true);
  };
  const { mutate: deleteVariantValue } = useDeleteVariantsValue();

  const confirmDelete = () => {
    if (variantToDelete) {
      deleteVariant(variantToDelete);
    }
    setDeleteConfirmationOpen(false);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(variantSchema),
  });
  const {
    register: registerValueForm,
    handleSubmit: handleSubmitValueForm,
    reset: resetValueForm,
  } = useForm<ProductVariantValueFormInput>();

  const openValueModal = (variantId: string) => {
    setActiveVariantId(variantId);
    setSelectedColor('');
    setInputValue('');
    setIsValueModalOpen(true);
  };
  console.log('variantId', variantId);
  const onSubmitValue: SubmitHandler<ProductVariantValueFormInput> = (data) => {
    if (activeVariantId === null) return;

    const currentVariant = variantsAPIData.find(
      (variant: any) => variant.id === activeVariantId
    );

    const valueToAdd =
      currentVariant?.name[0] === 'color' ? selectedColor : data.value.trim();

    if (!valueToAdd) return;
    if (isValueEditMode && editingValue) {
      updateVariantValue(
        { id: editingValue.id, value: valueToAdd, attribute: activeVariantId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variantValues'] });
            setIsValueModalOpen(false);
            setIsValueEditMode(false);
            setEditingValue(null);
            resetValueForm();
            resetForm();
          },
        }
      );
    } else {
      createVariantValue(
        { id: null, value: valueToAdd, attribute: activeVariantId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variantValues'] });
            setActiveVariantId(null);
            resetValueForm();
            setIsValueModalOpen(false);
            resetForm();
          },
        }
      );
    }
  };

  const handleEditVariant = (variant: any) => {
    setEditingVariant(variant);
    setIsEditMode(true);
    setIsModalOpen(true);

    if (
      variant.name === 'Color' ||
      variant.name === 'Material' ||
      variant.name === 'Seater'
    ) {
      setSelectedVariantType(variant.name);
      setVariantName('');
    } else {
      setSelectedVariantType('Custom');
      setVariantName(variant.name);
    }
  };
  const handleEditValue = (valueData: any) => {
    setEditingValue(valueData);
    setIsValueEditMode(true);
    setIsValueModalOpen(true);

    const currentVariant = variantsAPIData.find(
      (variant: any) => variant.id === valueData.attribute
    );

    if (currentVariant?.name.toLowerCase() === 'color') {
      setSelectedColor(valueData.value);
    } else {
      resetValueForm({ value: valueData.value });
    }

    setActiveVariantId(valueData.attribute);
  };
  const onSubmit: SubmitHandler<ProductVariantFormInput> = (formData) => {
    const nameToSave =
      selectedVariantType === 'Custom'
        ? formData.name.trim()
        : selectedVariantType;

    if (!nameToSave) return;

    if (isEditMode && editingVariant) {
      // Update existing variant
      updateVariant(
        {
          id: editingVariant.id,
          name: nameToSave,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variantsList'] });
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditingVariant(null);
            resetForm();
          },
          onError: (error) => {
            console.error('Error updating variant:', error);
          },
        }
      );
    } else {
      // Create new variant
      createVariants(
        {
          id: null,
          name: nameToSave,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variantsList'] });
            setIsModalOpen(false);
            resetForm();
          },
          onError: (error) => {
            console.error('Error creating variant:', error);
          },
        }
      );
    }
  };
  const resetForm = () => {
    reset();
    setEditingVariant(null);
    setIsEditMode(false);
    setVariantName('');
    setSelectedVariantType('Color');
    setIsModalOpen(false);
  };
  const getModalContent = () => {
    const currentVariant = variantsAPIData.find(
      (variant: any) => variant.id === activeVariantId
    );
    if (!currentVariant) return null;

    if (currentVariant.name.toLowerCase() === 'color') {
      return (
        <>
          <div className="text-sm font-medium text-gray-700">
            Select a color
          </div>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`h-10 w-10 rounded-full border-2 ${
                  selectedColor === color
                    ? 'border-gray-800'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </>
      );
    }
  };
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            type="submit"
            className="col-span-full ml-auto w-auto"
          >
            <PiPlusBold className="me-2 h-4 w-4" /> Add Variant
          </Button>
        </div>
      </PageHeader>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
      >
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {isEditMode ? 'Edit Variant' : 'Add New Variant'}
          </h2>
          <Form<ProductVariantFormInput>
            validationSchema={variantSchema}
            resetValues={reset}
            onSubmit={onSubmit}
            useFormProps={{
              mode: 'onChange',
              defaultValues: isEditMode
                ? {
                    name: editingVariant?.name || '',
                  }
                : { name: '' },
              resolver: zodResolver(variantSchema),
            }}
            className="space-y-4 p-6"
          >
            {({ register, formState: { errors } }) => (
              <>
                <label className="text-sm font-medium text-gray-700">
                  Choose a variant type
                </label>
                <select
                  value={selectedVariantType}
                  onChange={(e) => setSelectedVariantType(e.target.value)}
                  className="w-full rounded border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="Color">Color</option>
                  <option value="Material">Material</option>
                  <option value="Seater">Seater</option>
                  <option value="Custom">Custom</option>
                </select>
                {selectedVariantType === 'Custom' && (
                  <div>
                    <Input
                      type="text"
                      label="Enter custom variant name"
                      placeholder="e.g. Fabric, Height"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.name?.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Variant</Button>
                </div>
              </>
            )}
          </Form>
        </div>
      </Modal>
      <Modal
        isOpen={isValueModalOpen}
        onClose={() => {
          setIsValueModalOpen(false);
          setIsValueEditMode(false);
          setEditingValue(null);
          resetValueForm();
        }}
      >
        <Form<ProductVariantValueFormInput>
          validationSchema={variantValueSchema}
          resetValues={reset}
          onSubmit={onSubmitValue}
          useFormProps={{
            mode: 'onChange',
            defaultValues:
              isValueEditMode && editingValue
                ? { value: editingValue.value }
                : { value: '' },
            resolver: zodResolver(variantValueSchema),
          }}
          className="space-y-4 p-6"
        >
          {({ register, formState: { errors } }) => (
            <>
              {getModalContent()}
              {variantsAPIData
                ?.find((variant: any) => variant.id === activeVariantId)
                ?.name.toLowerCase() !== 'color' && (
                <div>
                  <Input
                    type="text"
                    label="Enter value"
                    placeholder="e.g. Blue, Leather, 3-seater"
                    {...register('value')}
                  />
                  {errors.value && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.value.message}
                    </p>
                  )}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsValueModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    variantsAPIData
                      ?.find((variant: any) => variant.id === activeVariantId)
                      ?.name.toLowerCase() === 'color'
                      ? !selectedColor
                      : false
                  }
                >
                  {isValueEditMode ? 'Update Value' : 'Save Value'}
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal>

      <Modal
        isOpen={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
      >
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Delete Variant</h2>
          <p className="mb-6">Are you sure you want to delete this variant?</p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmationOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="solid" color="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      <div className="mt-8 space-y-4 px-6">
        {variantsAPIData.map((variant: any, index: number) => {
          const variantValues = variantvalueAPIData.filter(
            (value: any) => value.attribute === variant.id
          );

          return (
            <div key={index} className="space-y-2 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-800">
                  {variant.name}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      openValueModal(variant.id);
                    }}
                  >
                    <PiPlusBold className="me-2 h-4 w-4" /> Add Value
                  </Button>
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
                      onClick={() => handleEditVariant(variant)}
                      className="hover:text-gray-700"
                    >
                      <PencilIcon className="size-4" />
                    </ActionIcon>
                  </Tooltip>

                  <ActionIcon
                    size="sm"
                    variant="outline"
                    aria-label="Delete Variant"
                    onClick={() => handleDeleteClick(variant.id)}
                    className="hover:text-red-600"
                  >
                    <TrashIcon className="size-4" />
                  </ActionIcon>
                </div>
              </div>
              {variantValues.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {variantValues.map((valueData: any) => (
                      <div
                        key={valueData.id}
                        className="relative flex items-center gap-1 px-3 py-1"
                      >
                        {variant.name.toLowerCase() === 'color' ? (
                          <>
                            <div
                              className="h-4 w-4"
                              style={{ backgroundColor: valueData.value }}
                            />
                            <span className="text-xs">{valueData.value}</span>
                          </>
                        ) : (
                          <span className="text-xs">{valueData.value}</span>
                        )}

                        {/* Edit Icon */}
                        <Tooltip
                          size="sm"
                          content="Edit Value"
                          placement="top"
                          color="invert"
                        >
                          <ActionIcon
                            as="span"
                            size="sm"
                            variant="outline"
                            aria-label="Edit Variant"
                            onClick={() => handleEditValue(valueData)}
                            className="hover:text-blue-600"
                          >
                            <PencilIcon className="size-3" />
                          </ActionIcon>
                        </Tooltip>

                        {/* Delete Icon */}
                        <DeletePopover
                          onDelete={() => {
                            deleteVariantValue(valueData.id, {
                              onSuccess: () => {
                                queryClient.invalidateQueries({
                                  queryKey: ['variantValues'],
                                });
                              },
                            });
                          }}
                          title="Delete the Value"
                          description="Are you sure you want to delete this value?"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
