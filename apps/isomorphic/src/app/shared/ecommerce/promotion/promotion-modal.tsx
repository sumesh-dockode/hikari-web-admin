'use client';

import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Button, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import UploadZone from '@core/ui/file-upload/upload-zone';
import {
  PromotionFormInput,
  promotionFormSchema,
} from '@/validators/create-promotion-schema';

export default function PromotionModal({
  isOpen,
  onClose,
  promotion,
}: {
  isOpen: boolean;
  onClose: () => void;
  promotion?: PromotionFormInput;
}) {
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<PromotionFormInput> = (data) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Submitted Promotion Data ->', data);
      setReset({ images: '' });
      onClose(); // Close modal after submission
    }, 600);
  };

  if (!isOpen) return null; // Prevent rendering when closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <Form<PromotionFormInput>
          validationSchema={promotionFormSchema}
          resetValues={reset}
          onSubmit={onSubmit}
          useFormProps={{
            mode: 'onChange',
            defaultValues: promotion, // Use row data as default
          }}
          className="flex flex-col space-y-4"
        >
          {({ register, control, getValues, setValue }) => (
            <>
              <Title as="h6" className="font-semibold">
                {promotion ? 'Edit Promotion' : 'Create Promotion'}
              </Title>

              <UploadZone
                name="images"
                getValues={getValues}
                setValue={setValue}
                className="col-span-full"
              />

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  {promotion ? 'Update' : 'Create'}
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  );
}
