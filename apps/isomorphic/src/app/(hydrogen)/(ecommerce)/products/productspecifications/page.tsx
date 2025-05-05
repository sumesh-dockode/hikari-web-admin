'use client';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import {
  ProductSpecificationFormInput,
  ProductSpecificationValueFormInput,
  SpecificationSchema,
  SpecificationValueSchema,
} from '@/validators/product-specification-schema';
import { Modal } from '@core/modal-views/modal';
import React, { useState } from 'react';
import { PiPlusBold } from 'react-icons/pi';
import { Button } from 'rizzui/button';
import { Form } from '@core/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from 'rizzui/input';
import TrashIcon from '@core/components/icons/trash';
import { Tooltip } from 'rizzui/tooltip';
import { ActionIcon } from 'rizzui/action-icon';
import PencilIcon from '@core/components/icons/pencil';
import { useQueryClient } from '@tanstack/react-query';
import useSpecifications from '@/hooks/products/specifications/useSpecifications';
import { useSpecificationById } from '@/hooks/products/specifications/useSpecificationById';
import { useCreateSpecifications } from '@/hooks/products/specifications/useCreateSpecification';
import { useUpdateSpecification } from '@/hooks/products/specifications/useUpdateSpecification';
import { useDeleteSpecification } from '@/hooks/products/specifications/useDeleteSpecification';
import useSpecificationValue from '@/hooks/products/specificationValues/useSpecificationValue';
import { useCreateSpecificationValue } from '@/hooks/products/specificationValues/useCreateSpecificationValue';
import { useUpdateSpecificationValue } from '@/hooks/products/specificationValues/useUpdateSpecificationValue';
import { useDeleteSpecificationValue } from '@/hooks/products/specificationValues/useDeleteSpecificationValue';

const pageHeader = {
  title: 'Product Specifications',
  breadcrumb: [
    { href: routes.eCommerce.dashboard, name: 'Home' },
    { href: routes.eCommerce.productSpecifications, name: 'specifications' },
    { name: 'List' },
  ],
};

export default function ProductSpecificationPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useSpecifications();
  // const { isLoading: isFetching } = useSpecificationById(specificationId || '');
  const {
    mutate: createSpecifications,
    data: specificationData,
    status: createStatus,
  } = useCreateSpecifications();
  const {
    mutate: updateSpecification,
    data: updateResponseData,
    status: updateStatus,
  } = useUpdateSpecification();
  const { mutate: deleteSpecification, status: deleteStatus } =
    useDeleteSpecification();
  const {
    data: specificationValuesData,
    isLoading: isSpecificationValueLoading,
    isError: isSpecificationValueError,
  } = useSpecificationValue();
  const {
    mutate: createSpecificationValue,
    data: specificationValueData,
    status: createsStatus,
  } = useCreateSpecificationValue();
  const {
    mutate: updateSpecificationValue,
    data: updateValueResponseData,
    status: updateValueStatus,
  } = useUpdateSpecificationValue();
  const { mutate: deleteVariantValue } = useDeleteSpecificationValue();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecificationType, setSelectedSpecificationType] =
    useState<string>('Color');
  const [specificationName, setSpecificationName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const specificationAPIData =
    data?.pages?.flatMap((page: any) => page?.data?.results) || [];
  const specificationValueAPIData =
    specificationValuesData?.pages?.flatMap(
      (page: any) => page?.data?.results
    ) || [];

  const openValueModal = (specificationId: string) => {
    setActiveSpecificationId(specificationId);
    setIsValueModalOpen(true);
  };

  const confirmDelete = () => {
    if (specificationToDelete) {
      deleteSpecification(specificationToDelete);
    }
    setDeleteConfirmationOpen(false);
  };

  const [activeSpecificationId, setActiveSpecificationId] = useState<
    string | null
  >(null);
  const [editingSpecification, setEditingSpecification] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingValue, setEditingValue] = useState<any>(null);
  const [isValueEditMode, setIsValueEditMode] = useState(false);
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [specificationToDelete, setSpecificationToDelete] = useState<
    any | null
  >(null);

  const {
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<ProductSpecificationFormInput>({
    resolver: zodResolver(SpecificationSchema),
    defaultValues: {
      value: '',
    },
  });

  const {
    reset: resetValueForm,
    handleSubmit: handleSubmitValue,
    formState: { errors: valueErrors },
    register: registerValue,
  } = useForm<ProductSpecificationValueFormInput>({
    resolver: zodResolver(SpecificationValueSchema),
    defaultValues: {
      value: '',
    },
  });

  const handleEditSpecification = (specification: any) => {
    setEditingSpecification(specification);
    setIsEditMode(true);
    setIsModalOpen(true);

    if (
      specification.name === 'Color' ||
      specification.name === 'Material' ||
      specification.name === 'Seater'
    ) {
      setSelectedSpecificationType(specification.name);
    } else {
      setSelectedSpecificationType('Custom');
      setSpecificationName(specification.name);
    }
  };

  const handleDeleteClick = (specificationId: string) => {
    setSpecificationToDelete(specificationId);
    setDeleteConfirmationOpen(true);
  };

  const onSubmit: SubmitHandler<ProductSpecificationFormInput> = (formData) => {
    const specificationData =
      selectedSpecificationType === 'Custom'
        ? formData.value
        : selectedSpecificationType;

    if (isEditMode && editingSpecification) {
      updateSpecification(
        { id: editingSpecification.id, name: specificationData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            resetForm();
            setIsEditMode(false);
            setEditingSpecification(null);
            queryClient.invalidateQueries({ queryKey: ['specificationsList'] });
          },
          onError: (error) => {
            console.error('Error updating specification:', error);
          },
        }
      );
    } else {
      createSpecifications(
        { name: specificationData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            resetForm();
            queryClient.invalidateQueries({ queryKey: ['specificationsList'] });
          },
          onError: (error) => {
            console.error('Error creating specification:', error);
          },
        }
      );
    }
  };


  const getModalContent = () => {
    if (!activeSpecificationId) return null;

    const specification = specificationAPIData.find(
      (spec: any) => spec.id === activeSpecificationId
    );

    if (!specification) return null;

    if (specification.name.toLowerCase() === 'color') {
      return (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Select Color
          </label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="h-10 w-full cursor-pointer"
          />
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
            onClick={() => {
              setIsEditMode(false);
              setEditingSpecification(null);
              setSelectedSpecificationType('Color');
              setSpecificationName('');
              setIsModalOpen(true);
            }}
            variant="outline"
            type="submit"
            className="col-span-full ml-auto w-auto"
          >
            <PiPlusBold className="me-2 h-4 w-4" /> Add Specification
          </Button>
        </div>
      </PageHeader>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
          setIsEditMode(false);
          setEditingSpecification(null);
        }}
      >
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {isEditMode ? 'Edit Specification' : 'Add New Specification'}
          </h2>
          <Form<ProductSpecificationFormInput>
            validationSchema={SpecificationSchema}
            // resetValues={reset}
            onSubmit={onSubmit}
            useFormProps={{
              mode: 'onChange',
              defaultValues: isEditMode
                ? {
                    value: editingSpecification?.name || '',
                  }
                : { value: '' },
              resolver: zodResolver(SpecificationSchema),
            }}
            className="space-y-4 p-6"
          >
            {({ register, formState: { errors } }) => (
              <>
                <label className="text-sm font-medium text-gray-700">
                  Choose a variant type
                </label>
                <select
                  value={selectedSpecificationType}
                  onChange={(e) => setSelectedSpecificationType(e.target.value)}
                  className="w-full rounded border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="Color">Color</option>
                  <option value="Material">Material</option>
                  <option value="Seater">Seater</option>
                  <option value="Custom">Custom</option>
                </select>
                {selectedSpecificationType === 'Custom' && (
                  <div>
                    <Input
                      type="text"
                      label="Enter custom variant name"
                      placeholder="e.g. Fabric, Height"
                      {...register('value')}
                    />
                    {errors.value && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.value?.message}
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
                  <Button type="submit">Save Specification</Button>
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
          resetValueForm();
          setSelectedColor('');
        }}
      >
       
      </Modal>
      <Modal
        isOpen={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
      >
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Delete Specification</h2>
          <p className="mb-6">
            Are you sure you want to delete this specification?
          </p>
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
        {specificationAPIData.map((specification: any, index: number) => (
          <div
            key={index}
            className="space-y-2 rounded border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-800">
                {specification.name}
              </div>

              <div className="flex gap-2">
                {/* <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    openValueModal(specification.id);
                  }}
                >
                  <PiPlusBold className="me-2 h-4 w-4" /> Add Value
                </Button> */}
                <Tooltip
                  size="sm"
                  content="Edit Specification"
                  placement="top"
                  color="invert"
                >
                  <ActionIcon
                    as="span"
                    size="sm"
                    variant="outline"
                    aria-label="Edit Specification"
                    onClick={() => handleEditSpecification(specification)}
                    className="hover:text-gray-700"
                  >
                    <PencilIcon className="size-4" />
                  </ActionIcon>
                </Tooltip>

                <ActionIcon
                  size="sm"
                  variant="outline"
                  aria-label="Delete Specification"
                  onClick={() => handleDeleteClick(specification.id)}
                  className="hover:text-black-900"
                >
                  <TrashIcon className="size-4" />
                </ActionIcon>
              </div>
            </div>
            {specificationValueAPIData.filter(
              (value: any) => value.product === specification.id
            ).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {specificationValueAPIData
                  .filter((value: any) => value.product === specification.id)
                  .map((valueData: any) => (
                    <div
                      key={valueData.id}
                      className="relative flex items-center"
                    >
                      {specification.name.toLowerCase() === 'color' ? (
                        <div
                          className="h-6 w-6 rounded-full border"
                          style={{ backgroundColor: valueData.value }}
                          title={valueData.value}
                        />
                      ) : (
                        <div className="rounded border bg-gray-100 px-3 py-1 text-xs text-gray-700">
                          {valueData.value}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
