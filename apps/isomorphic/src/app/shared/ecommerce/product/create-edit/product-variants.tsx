'use client';

import { useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Input, Button, ActionIcon, Select } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import FormGroup from '@/app/shared/form-group';
import TrashIcon from '@core/components/icons/trash';
import { Modal } from '@core/modal-views/modal';

export default function ProductVariants({ className }: { className?: string }) {
  const {
    control,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productVariants',
  });

  const colorOptions = [
    { label: 'Red', value: 'red' },
    { label: 'Black', value: 'black' },
    { label: 'Blue', value: 'blue' },
  ];

  const materialOptions = [
    { label: 'Leather', value: 'leather' },
    { label: 'Fabric', value: 'fabric' },
    { label: 'Velvet', value: 'velvet' },
  ];
  const seaterOptions = [
    { label: '2 seater', value: '2 seater' },
    { label: '3 seater', value: '3 seater' },
    { label: '5 seater', value: '5 seater' },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variantColor, setVariantColor] = useState('');
  const [variantPrice, setVariantPrice] = useState('');

  const handleAddProducts = () => {
    if (!variantColor || !variantPrice) return;

    append({ name: variantColor, value: parseFloat(variantPrice) });
    setVariantColor('');
    setVariantPrice('');
    setIsModalOpen(false);
  };

  return (
    <>
      <FormGroup
        title="Variant Options"
        description="Add your product variants here"
        className={cn(className)}
      >
        {fields.map((item, index) => (
          <div key={item.id} className="col-span-full flex gap-4 xl:gap-7">
            <Input
              label="Choose color"
              placeholder="Color, Size, etc."
              {...register(`productVariants.${index}.name`)}
              className="w-full @2xl:w-auto @2xl:flex-grow"
            />
            <Input
              type="number"
              label="Variant Price"
              placeholder="150.00"
              prefix="$"
              className="flex-grow"
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
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          className="col-span-full ml-auto w-auto"
        >
          <PiPlusBold className="me-2 h-4 w-4" /> Add Variant
        </Button>
      </FormGroup>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
        overlayClassName="backdrop-blur"
      >
        <div className="space-y-4 p-4">
          <Controller
            control={control}
            name={`productVariants color`}
            render={({ field }) => (
              <Select
                label="Color"
                options={colorOptions}
                value={field.value}
                onChange={field.onChange}
                className="w-full"
              />
            )}
          />
          <Controller
            control={control}
            name={`productVariants material`}
            render={({ field }) => (
              <Select
                label="Material"
                options={materialOptions}
                value={field.value}
                onChange={field.onChange}
                className="w-full"
              />
            )}
          />
          <Controller
            control={control}
            name={`productVariants seater`}
            render={({ field }) => (
              <Select
                label="Seater"
                options={seaterOptions}
                value={field.value}
                onChange={field.onChange}
                className="w-full"
              />
            )}
          />
          <Input
            type="number"
            label="Price"
            prefix="$"
            value={variantPrice}
            onChange={(e) => setVariantPrice(e.target.value)}
            placeholder="150.00"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProducts}>Save Variant</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
