'use client';

import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Button, Title } from 'rizzui';
import { Form } from '@core/ui/form';
import UploadZone from '@core/ui/file-upload/upload-zone';
import {
  PromotionFormInput,
  promotionFormSchema,
} from '@/validators/create-promotion.schema';

export type PromotionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  promotion?: PromotionFormInput;
};

export default function PromotionModal({
  isOpen,
  onClose,
  promotion,
}: PromotionModalProps) {
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<PromotionFormInput> = (data) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Submitted Promotion Data ->', data);
      setReset({ images: '' });
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <Form<PromotionFormInput>
          validationSchema={promotionFormSchema}
          resetValues={reset}
          onSubmit={onSubmit}
          useFormProps={{
            mode: 'onChange',
            defaultValues: promotion || {},
          }}
          className="flex flex-col space-y-4"
        >
          {({ getValues, setValue }) => (
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
