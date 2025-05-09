'use client';

import { useEffect, useState } from 'react';
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
import DeletePopover from '@core/components/delete-popover';
import { useUpdateVariant } from '@/hooks/products/variants/useUpdateVariant';
import useVariantValue from '@/hooks/products/variantValues/useVariantValue';
import { useDeleteVariants } from '@/hooks/products/variants/useDeleteVariants';
import { useCreateVariantsValues } from '@/hooks/products/variantValues/useCreateVariantValue';
import { useDeleteVariantsValue } from '@/hooks/products/variantValues/useDeleteVariantValue';
import { useUpdateVariantValue } from '@/hooks/products/variantValues/useUpdateVariantValue';
import toast from 'react-hot-toast';
import PencilIcon from '@core/components/icons/pencil';

const pageHeader = {
  title: 'Product Variants',
  breadcrumb: [
    { href: routes.eCommerce.dashboard, name: 'Home' },
    { href: routes.eCommerce.productVariants, name: 'Variants' },
    { name: 'List' },
  ],
};

export default function ProductVariantsPage() {
  const queryClient = useQueryClient();
  const { data } = useVariants();
  const { data: variantValuesData } = useVariantValue();
  const { mutate: createVariantValue } = useCreateVariantsValues();
  const { mutate: updateVariantValue } = useUpdateVariantValue();
  const { mutate: createVariants } = useCreateVariants();
  const { mutate: updateVariant } = useUpdateVariant();
  const { mutate: deleteVariant } = useDeleteVariants();
  const { mutate: deleteVariantValue } = useDeleteVariantsValue();

  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [editingValue, setEditingValue] = useState<any>(null);
  const [isValueEditMode, setIsValueEditMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [selectedVariantType, setSelectedVariantType] =
    useState<string>('Color');

  const variantsAPIData =
    data?.pages?.flatMap((page: any) => page?.data?.results) || [];
  const variantvalueAPIData =
    variantValuesData?.pages?.flatMap((page: any) => page?.data?.results) || [];

  // Reset form when editingVariant changes
  useEffect(() => {
    if (isEditMode && editingVariant) {
      reset({
        name: editingVariant.name || '',
      });
    }
  }, [editingVariant, isEditMode]);

  // Reset value form when editingValue changes
  useEffect(() => {
    if (isValueEditMode && editingValue) {
      const currentVariant = variantsAPIData.find(
        (variant: any) => variant.id === editingValue.attribute
      );

      if (currentVariant?.name.toLowerCase() === 'color') {
        setSelectedColor(editingValue.value || '#000000');
      } else {
        resetValueForm({ value: editingValue.value || '' });
      }
    }
  }, [editingValue]);

  const handleDeleteClick = (variantId: string) => {
    setVariantToDelete(variantId);
    setDeleteConfirmationOpen(true);
  };

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
  } = useForm<ProductVariantFormInput>({
    resolver: zodResolver(variantSchema),
  });

  const {
    register: registerValueForm,
    handleSubmit: handleSubmitValueForm,
    reset: resetValueForm,
    formState: { errors: valueErrors },
  } = useForm<ProductVariantValueFormInput>({
    resolver: zodResolver(variantValueSchema),
  });

  const openValueModal = (variantId: string) => {
    setActiveVariantId(variantId);
    setSelectedColor('#000000');
    setIsValueModalOpen(true);
    setIsValueEditMode(false);
    setEditingValue(null);
  };

  const onSubmitValue: SubmitHandler<ProductVariantValueFormInput> = (data) => {
    if (activeVariantId === null) return;

    const currentVariant = variantsAPIData.find(
      (variant: any) => variant.id === activeVariantId
    );

    const isColorVariant = currentVariant?.name.toLowerCase() === 'color';
    const valueToAdd = isColorVariant ? selectedColor : data.value.trim();

    if (!valueToAdd) {
      toast.error('Please provide a value');
      return;
    }

    if (isValueEditMode && editingValue) {
      updateVariantValue(
        {
          id: editingValue.id,
          value: valueToAdd,
          attribute: activeVariantId,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variantValues'] });
            setIsValueModalOpen(false);
            setIsValueEditMode(false);
            setEditingValue(null);
            resetValueForm();
            setSelectedColor('#000000');
          },
        }
      );
    } else {
      createVariantValue(
        {
          id: null,
          value: valueToAdd,
          attribute: activeVariantId,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variantValues'] });
            setIsValueModalOpen(false);
            resetValueForm();
            setSelectedColor('#000000');
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
    } else {
      setSelectedVariantType('Custom');
    }
  };

  const handleEditValue = (valueData: any) => {
    setEditingValue(valueData);
    setIsValueEditMode(true);
    setIsValueModalOpen(true);
    setActiveVariantId(valueData.attribute);
  };

  const onSubmit: SubmitHandler<ProductVariantFormInput> = (formData) => {
    const nameToSave =
      selectedVariantType === 'Custom'
        ? formData.name.trim()
        : selectedVariantType;

    if (!nameToSave) return;

    const isDuplicate = variantsAPIData.some(
      (variant: any) =>
        variant.name.toLowerCase() === nameToSave.toLowerCase() &&
        (!isEditMode || variant.id !== editingVariant?.id)
    );

    if (isDuplicate) {
      setDuplicateError(
        `A variant with the name "${nameToSave}" already exists.`
      );
      return;
    }

    setDuplicateError(null);

    if (isEditMode && editingVariant) {
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
        }
      );
    } else {
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
        }
      );
    }
  };

  const resetForm = () => {
    reset();
    setEditingVariant(null);
    setIsEditMode(false);
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
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value || '#000000')}
                className="h-10 w-10 cursor-pointer rounded border border-gray-300"
              />
              <Input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value || '#000000')}
                placeholder="Enter hex code (e.g. #FF0000)"
                className="flex-1"
              />
            </div>
            {selectedColor && (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-gray-50 p-2">
                <div
                  className="h-5 w-5 rounded-full border border-gray-300"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="text-sm font-medium">{selectedColor}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="col-span-full ml-auto w-auto"
          >
            <PiPlusBold className="me-2 h-4 w-4" /> Add Variant
          </Button>
        </div>
      </PageHeader>

      {/* Variant Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDuplicateError(null);
          setEditingVariant(null);
          setIsEditMode(false);
          setSelectedVariantType('Color');
          reset();
        }}
      >
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {isEditMode ? 'Edit Variant' : 'Add New Variant'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Choose a variant type
              </label>
              <select
                value={selectedVariantType}
                onChange={(e) => {
                  setSelectedVariantType(e.target.value);
                  setDuplicateError(null);
                }}
                className="w-full rounded border-gray-300 px-3 py-2 text-sm"
              >
                <option value="Color">Color</option>
                <option value="Material">Material</option>
                <option value="Seater">Seater</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {selectedVariantType === 'Custom' && (
              <div>
                <Input
                  type="text"
                  label="Enter custom variant name"
                  placeholder="e.g. Fabric, Height"
                  {...register('name', {
                    onChange: () => setDuplicateError(null),
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name?.message}
                  </p>
                )}
              </div>
            )}

            {duplicateError && (
              <p className="text-sm text-red-500">{duplicateError}</p>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setDuplicateError(null);
                  setEditingVariant(null);
                  setIsEditMode(false);
                  setSelectedVariantType('Color');
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="solid">
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Value Modal */}
      <Modal
        isOpen={isValueModalOpen}
        onClose={() => {
          setIsValueModalOpen(false);
          setIsValueEditMode(false);
          setEditingValue(null);
          resetValueForm();
          setSelectedColor('#000000');
        }}
      >
        <form
          onSubmit={handleSubmitValueForm(onSubmitValue)}
          className="space-y-4 p-6"
        >
          {getModalContent()}
          {variantsAPIData
            ?.find((variant: any) => variant.id === activeVariantId)
            ?.name.toLowerCase() !== 'color' && (
            <div>
              <Input
                type="text"
                label="Enter value"
                placeholder="e.g. Blue, Leather, 3-seater"
                {...registerValueForm('value')}
              />
              {valueErrors.value && (
                <p className="mt-1 text-xs text-red-500">
                  {valueErrors.value.message}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsValueModalOpen(false);
                setIsValueEditMode(false);
                setEditingValue(null);
                resetValueForm();
                setSelectedColor('#000000');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="solid">
              {isValueEditMode ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
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

      {/* Variants List */}
      <div className="mt-8 space-y-4 px-6">
        {variantsAPIData.map((variant: any, index: number) => {
          const variantValues = variantvalueAPIData.filter(
            (value: any) => value.attribute === variant.id
          );
          return (
            <div
              key={index}
              className="space-y-2 rounded-lg border p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-800">
                  {variant.name}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openValueModal(variant.id)}
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
                        className="relative flex items-center gap-1 rounded-full border px-3 py-1"
                      >
                        {variant.name.toLowerCase() === 'color' ? (
                          <>
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: valueData.value }}
                            />
                            <span className="text-xs">{valueData.value}</span>
                          </>
                        ) : (
                          <span className="text-xs">{valueData.value}</span>
                        )}

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
