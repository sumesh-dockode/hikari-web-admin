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
} from '@/app/shared/ecommerce/product/create-edit/form-utils';
import SelectLoader from '@core/components/loader/select-loader';

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
  const addVariant = useCallback(() => append([...productVariants]), [append]);

  return (
    <>
      <FormGroup
        title="Variant Options"
        description="Add your product variants here"
        className={cn(className)}
      >
        {fields.map((item, index) => (
          <div key={item.id} className="col-span-full flex gap-4 xl:gap-7">
            <Controller
              name={`productVariants.${index}.name`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  options={variantOption}
                  value={value}
                  onChange={onChange}
                  label="Variant Name"
                  className="w-full @2xl:w-auto @2xl:flex-grow"
                  getOptionValue={(option) => option.value}
                />
              )}
            />
            <Input
              type="text"
              label="Variant Value"
              placeholder="Variant Value"
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
          onClick={addVariant}
          variant="outline"
          className="col-span-full ml-auto w-auto"
        >
          <PiPlusBold className="me-2 h-4 w-4" /> Add Variant
        </Button>
      </FormGroup>
    </>
  );
}
