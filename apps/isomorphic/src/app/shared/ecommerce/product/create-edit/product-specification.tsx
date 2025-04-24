'use client';
import { useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Input, Button, ActionIcon, Select } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import FormGroup from '@/app/shared/form-group';
import TrashIcon from '@core/components/icons/trash';
import { Modal } from '@core/modal-views/modal';
import { useCallback } from 'react';
import {
  variantOption,
  productVariants,
  productSpecifications,
} from '@/app/shared/ecommerce/product/create-edit/form-utils';
import SelectLoader from '@core/components/loader/select-loader';

export default function ProductSpecification({
  className,
}: {
  className?: string;
}) {
  const {
    control,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productSpecifications',
  });
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const addSpecification = useCallback(
    () => append([...productSpecifications]),
    [append]
  );

  const handleAddSpecification = useCallback(() => {
    const newVariant = {
      name: getValues('newSpecificationName'),
      value: getValues('newSpecificationValue'),
    };
    append(newVariant);
    setIsModalOpen(false);
    // Reset modal fields
    setValue('newSpecificationName', '');
    setValue('newSpecificationValue', '');
    setSelectedVariantId(null);
  }, [append, getValues, setValue]);

  return (
    <>
      <FormGroup
        title="Specification Options"
        description="Add your product specifications here"
        className={cn(className)}
      >
        {fields.map((item, index) => (
          <div key={item.id} className="col-span-full flex gap-4 xl:gap-7">
            <Controller
              name={`productSpecifications.${index}.name`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  options={productSpecifications}
                  value={value}
                  onChange={onChange}
                  label="Specification Name"
                  className="w-full @2xl:w-auto @2xl:flex-grow"
                  getOptionValue={(option) => option.value}
                />
              )}
            />
            <Input
              type="number"
              label="Specification Value"
              placeholder="150.00"
              className="flex-grow"
              prefix={'$'}
              {...register(`productVariants.${index}.value`)}
            />
            {fields.length > 1 && (
              <ActionIcon
                onClick={() => remove(index)}
                variant="flat"
                className="mt-7 shrink-0"
              >
                <TrashIcon className="h-4 w-4" />
              </ActionIcon>
            )}
          </div>
        ))}
        <Button
          onClick={addSpecification}
          variant="outline"
          className="col-span-full ml-auto w-auto"
        >
          <PiPlusBold className="me-2 h-4 w-4" /> Add Specification
        </Button>
      </FormGroup>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4">
          <h2 className="mb-4 text-lg font-bold">Add New Specification</h2>
          <div className="space-y-4">
            <Controller
              name="newSpecificationName"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  options={variantOption}
                  value={value}
                  onChange={onChange}
                  label="Specification Name"
                  className="w-full"
                  getOptionValue={(option) => option.value}
                />
              )}
            />
            <Controller
              name={`productVariants`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  options={variantOption}
                  value={value}
                  onChange={onChange}
                  label="Specification Value"
                  className="w-full @2xl:w-auto @2xl:flex-grow"
                  getOptionValue={(option) => option.value}
                />
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSpecification}>Add Specification</Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
