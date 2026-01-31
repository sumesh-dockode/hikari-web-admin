'use client';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import {
  ProductSpecificationFormInput,
  SpecificationSchema,
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
import { useCreateSpecifications } from '@/hooks/products/specifications/useCreateSpecification';
import { useUpdateSpecification } from '@/hooks/products/specifications/useUpdateSpecification';
import { useDeleteSpecification } from '@/hooks/products/specifications/useDeleteSpecification';

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
  const { data } = useSpecifications();
  const { mutate: createSpecifications } = useCreateSpecifications();
  const { mutate: updateSpecification } = useUpdateSpecification();
  const { mutate: deleteSpecification } = useDeleteSpecification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [specificationToDelete, setSpecificationToDelete] = useState<
    any | null
  >(null);
  const [editingSpecification, setEditingSpecification] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reset, setReset] = useState({ specification: '' });

  const specificationAPIData = data?.data || [];

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ProductSpecificationFormInput>({
    resolver: zodResolver(SpecificationSchema),
  });

  const handleEditSpecification = (specification: any) => {
    setEditingSpecification(specification);
    setIsEditMode(true);
    setIsModalOpen(true);
    setReset({ specification: specification.name });
  };

  const handleDeleteClick = (specificationId: string) => {
    setSpecificationToDelete(specificationId);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = () => {
    if (specificationToDelete) {
      deleteSpecification(specificationToDelete, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['specificationsList'] });
        },
      });
    }
    setDeleteConfirmationOpen(false);
  };

  const onSubmit: SubmitHandler<ProductSpecificationFormInput> = (formData) => {
    if (isEditMode && editingSpecification) {
      updateSpecification(
        { id: editingSpecification.id, name: formData.specification },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setReset({ specification: '' });
            setIsEditMode(false);
            setEditingSpecification(null);
            queryClient.invalidateQueries({ queryKey: ['specificationsList'] });
          },
        }
      );
    } else {
      createSpecifications(
        { name: formData.specification },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setReset({ specification: '' });
            queryClient.invalidateQueries({ queryKey: ['specificationsList'] });
          },
        }
      );
    }
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Button
            onClick={() => {
              setIsEditMode(false);
              setEditingSpecification(null);
              setReset({ specification: '' });
              setIsModalOpen(true);
            }}
            variant="outline"
            className="col-span-full ml-auto w-auto"
          >
            <PiPlusBold className="me-2 h-4 w-4" /> Add Specification
          </Button>
        </div>
      </PageHeader>

      {/* Add/Edit Specification Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setReset({ specification: '' });
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
            resetValues={reset}
            onSubmit={onSubmit}
            useFormProps={{
              mode: 'onChange',
              resolver: zodResolver(SpecificationSchema),
            }}
            className="space-y-4 p-6"
          >
            {({ register, formState: { errors } }) => (
              <>
                <Input
                  type="text"
                  label="Specification Name"
                  placeholder="e.g. Color, Material, Size"
                  {...register('specification')}
                  error={errors.specification?.message}
                />
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmit(onSubmit)();
                    }}
                  >
                    {isEditMode ? 'Update' : 'Save'} Specification
                  </Button>
                </div>
              </>
            )}
          </Form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
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

      {/* Specifications List */}
      <div className="mt-8 space-y-4 px-6">
        {specificationAPIData.map((specification: any) => (
          <div
            key={specification.id}
            className="space-y-2 rounded border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-800">
                {specification.name}
              </div>
              <div className="flex gap-2">
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
          </div>
        ))}
      </div>
    </>
  );
}
