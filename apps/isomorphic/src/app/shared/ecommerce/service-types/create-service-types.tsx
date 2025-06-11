'use client';

import { routes } from '@/config/routes';
import { useCreateServiceTypes } from '@/hooks/serviceTypes/useCreateServiceTypes';
import { useServiceTypesById } from '@/hooks/serviceTypes/useServiceTypesById';
import { useUpdateServiceTypes } from '@/hooks/serviceTypes/useUpdateServiceTypes';
import {
  ServiceTypesFormInput,
  serviceTypesFormSchema,
} from '@/validators/create-service-types.schema';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import PageLoader from '../../page-loader';
import { Form } from '@core/ui/form';
import FormGroup from '../../form-group';
import { Input } from 'rizzui/input';
import { Textarea } from 'rizzui/textarea';
import cn from '@core/utils/class-names';
import { Button } from 'rizzui/button';

const DefaultValues = {
  name: '',
  description: '',
  // price: 0,
  // duration: 0,
};
export default function CreateServiceTypes({ id }: { id?: string }) {
  const { push } = useRouter();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const {
    data,
    isLoading: isFetching,
    error: fetchError,
  } = useServiceTypesById(id || '');
  const {
    mutate: createServiceTypes,
    data: serviceTypesData,
    status: createStatus,
  } = useCreateServiceTypes();

  const {
    mutate: updateServiceTypes,
    data: updateResponseData,
    status: updateStatus,
  } = useUpdateServiceTypes();

  useEffect(() => {
    if (data) {
      const detailData = data?.data;
      setReset(detailData);
    }
  }, [data]);

  const onSubmit: SubmitHandler<ServiceTypesFormInput> = (data) => {
    setLoading(true);
    let payload = {
      id: id || null,
      name: data.name || '',
      description: data.description || '',
      price: data.price,
      duration: data.duration || 0,
    };

    id ? updateServiceTypes(payload) : createServiceTypes(payload);
  };

  useEffect(() => {
    if (createStatus === 'pending' || updateStatus === 'pending') return;

    if (
      (createStatus === 'success' && serviceTypesData) ||
      (updateStatus === 'success' && updateResponseData)
    ) {
      toast.success(
        id
          ? 'Service type updated successfully'
          : 'Service type created successfully'
      );

      setReset(DefaultValues);

      push(routes.eCommerce.serviceTypes);

      setLoading(false);
    } else if (createStatus === 'error' || updateStatus === 'error') {
      setLoading(false);
    }
  }, [createStatus, updateStatus]);

  if (isFetching) return <PageLoader />;

  if (fetchError) throw fetchError;

  return (
    <Form<ServiceTypesFormInput>
      validationSchema={serviceTypesFormSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        mode: 'onChange',
        defaultValues: DefaultValues,
      }}
      className="isomorphic-form flex flex-grow flex-col @container"
    >
      {({ register, formState: { errors } }) => (
        <>
          <div className="flex-grow pb-10">
            <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              <FormGroup
                title={'Name'}
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  placeholder="Name"
                  {...register('name')}
                  error={errors.name?.message}
                  className="col-span-full"
                />
              </FormGroup>
              <FormGroup
                title={'Description'}
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Textarea
                  placeholder="Description"
                  {...register('description')}
                  error={errors.description?.message}
                  className="col-span-full"
                />
              </FormGroup>
              <FormGroup
                title={'Price & Duration'}
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  label="Price"
                  placeholder="Price"
                  {...register('price', { valueAsNumber: true })}
                  error={errors.price?.message as string}
                  prefix={<b>&#8377;</b>}
                  type="number"
                />
                <Input
                  label="Duration"
                  placeholder="Duration"
                  {...register('duration', { valueAsNumber: true })}
                  error={errors.duration?.message as string}
                  type="number"
                />
              </FormGroup>
            </div>
          </div>

          <div
            className={cn(
              'sticky bottom-0 z-40 flex items-center justify-end gap-3 bg-gray-0/10 py-1 backdrop-blur @lg:gap-4 @xl:grid @xl:auto-cols-max @xl:grid-flow-col'
            )}
          >
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full @xl:w-auto"
            >
              {id ? 'Update' : 'Create'} Service Type
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
