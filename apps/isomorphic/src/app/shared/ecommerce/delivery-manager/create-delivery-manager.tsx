'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SubmitHandler, Controller } from 'react-hook-form';
import SelectLoader from '@core/components/loader/select-loader';
import QuillLoader from '@core/components/loader/quill-loader';
import { Button, Input, Password, Select, Switch, Text, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import UploadZone from '@core/ui/file-upload/upload-zone';
import FormGroup from '../../form-group';
import AvatarUploadNew from '@core/ui/file-upload/avatar-upload-new';
import { PiEnvelopeSimple } from 'react-icons/pi';
import {
  DeliveryManagerFormInput,
  deliveryManagerFormSchema,
} from '@/validators/create-delivery-manager.schema';

const QuillEditor = dynamic(() => import('@core/ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[168px]" />,
});

// main category form component for create and update category
export default function CreateDeliveryManager({
  id,
  initialValue,
  isModalView = true,
}: {
  id?: string;
  isModalView?: boolean;
  initialValue?: DeliveryManagerFormInput;
}) {
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<DeliveryManagerFormInput> = (data) => {
    // set timeout ony required to display loading state of the create button
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('create delivery manager data ->', data);
      setReset({
        name: '',
        images: '',
      });
    }, 600);
  };

  return (
    <Form<DeliveryManagerFormInput>
      validationSchema={deliveryManagerFormSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        mode: 'onChange',
        defaultValues: initialValue,
      }}
      className="isomorphic-form flex flex-grow flex-col @container"
    >
      {({ register, control, getValues, setValue, formState: { errors } }) => (
        <>
          <div className="flex-grow pb-10">
            <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              <FormGroup
                title={'Name'}
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  placeholder="First Name"
                  {...register('first_name')}
                  error={errors.first_name?.message}
                  className="flex-grow"
                />
                <Input
                  placeholder="Last Name"
                  {...register('last_name')}
                  error={errors.last_name?.message}
                  className="flex-grow"
                />
              </FormGroup>
              <FormGroup
                title="Email Address"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  className="col-span-full"
                  prefix={
                    <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                  }
                  type="email"
                  placeholder="georgia.young@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </FormGroup>
              <FormGroup
                title={'Profile Picture'}
                description={'This will be displayed on profile.'}
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <div className="flex flex-col gap-6 @container @3xl:col-span-2">
                  <AvatarUploadNew
                    name="images"
                    setValue={setValue}
                    getValues={getValues}
                    error={errors?.images?.message as string}
                  />
                </div>
              </FormGroup>
              <FormGroup
                title={'Username & Password'}
                description={'This will be the login credential.'}
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  placeholder="Username"
                  {...register('username')}
                  error={errors.username?.message}
                  className="flex-grow"
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <Password
                      placeholder="Enter your password"
                      helperText={
                        getValues().password?.length < 8 &&
                        'Your current password must be more than 8 characters'
                      }
                      onChange={onChange}
                      error={errors.password?.message}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup
                title={'Status'}
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Switch
                  label="Active"
                  variant="flat"
                  labelClassName="font-medium text-sm text-gray-900"
                  {...register('is_active')}
                />
              </FormGroup>
            </div>
          </div>

          <div
            className={cn(
              'sticky bottom-0 z-40 flex items-center justify-end gap-3 bg-gray-0/10 backdrop-blur @lg:gap-4 @xl:grid @xl:auto-cols-max @xl:grid-flow-col',
              isModalView ? '-mx-10 -mb-7 px-10 py-5' : 'py-1'
            )}
          >
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full @xl:w-auto"
            >
              {id ? 'Update' : 'Create'} Delivery Manager
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
