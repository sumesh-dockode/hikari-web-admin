'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import isEmpty from 'lodash/isEmpty';
import { PiShoppingCartSimple } from 'react-icons/pi';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Product } from '@/types';
import { Button, Title, Text } from 'rizzui';
import { generateCartProduct } from '@/store/quick-cart/generate-cart-product';
import { ServiceDetailsInput, serviceValidateSchema } from '@/validators/service-validate-schema';
import { Form } from '@core/ui/form';
import UploadZone from '@core/ui/file-upload/upload-zone';

export type ServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  service?: ServiceDetailsInput;
};

export default function ServiceDetailSummary({
  isOpen,
  onClose,
  service,
}: ServiceModalProps) {
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<ServiceDetailsInput> = (data) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Submitted service Data ->', data);
      setReset({ images: '' });
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <Form<ServiceDetailsInput>
          validationSchema={serviceValidateSchema}
          resetValues={reset}
          onSubmit={onSubmit}
          useFormProps={{
            mode: 'onChange',
            defaultValues: service || {},
          }}
          className="flex flex-col space-y-4"
        >
          {({ getValues, setValue }) => (
            <>
              <Title as="h6" className="font-semibold">
                {service ? 'Edit service' : 'Create service'}
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
                  {service ? 'Update' : 'Create'}
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  );
}
