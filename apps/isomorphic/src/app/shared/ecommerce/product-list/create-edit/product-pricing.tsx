'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from 'rizzui';

export default function ProductPricing() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Input
        label="Price"
        placeholder="10"
        {...register('price')}
        error={errors.price?.message as string}
        prefix={<b>&#8377;</b>}
        // type="number"
      />
    </>
  );
}
