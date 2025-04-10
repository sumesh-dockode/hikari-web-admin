'use client';

import { useCallback } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Input, Switch, Button, ActionIcon } from 'rizzui';
import cn from '@core/utils/class-names';
import FormGroup from '@/app/shared/form-group';
import { locationShipping } from '@/app/shared/ecommerce/product/create-edit/form-utils';
import TrashIcon from '@core/components/icons/trash';
import { PiPlusBold } from 'react-icons/pi';

export default function ShippingInfo({ className }: { className?: string }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'locationShipping',
  });

  const addCustomField = useCallback(
    () => append([...locationShipping]),
    [append]
  );

  return (
    <FormGroup
      title="Shipping"
      description="Add your shipping info here"
      className={cn(className)}
    >
      <Controller
        name="NextdayShipping"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Switch
            label="Next Day Shipping"
            className="col-span-full"
            value={value}
            checked={value}
            onChange={onChange}
          />
        )}
      />
    </FormGroup>
  );
}
