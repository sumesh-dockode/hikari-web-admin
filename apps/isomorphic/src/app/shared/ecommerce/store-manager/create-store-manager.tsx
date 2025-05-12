'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { SubmitHandler, Controller } from 'react-hook-form';
import SelectLoader from '@core/components/loader/select-loader';
import QuillLoader from '@core/components/loader/quill-loader';
import {
  Button,
  Input,
  Password,
  Select,
  Switch,
  Text,
  Textarea,
  Title,
} from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import {
  getStoreManagerFormSchema,
  StoreManagerFormInput,
} from '@/validators/create-store-manager.schema';
import FormGroup from '../../form-group';
import { PiEnvelopeSimple } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import { useStoreManagerById } from '@/hooks/storeManager/useStoreManagerById';
import { useCreateStoreManager } from '@/hooks/storeManager/useCreateStoreManager';
import { useUpdateStoreManager } from '@/hooks/storeManager/useUpdateStoreManager';
import { routes } from '@/config/routes';
import toast from 'react-hot-toast';
import PageLoader from '../../page-loader';
import { PhoneNumber } from '@core/ui/phone-input';

const DefaultValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  username: '',
  password: '',
  is_active: false,
  store_name: '',
  store_address: '',
};

// main category form component for create and update category
export default function CreateStoreManager({
  id,
  isModalView = true,
}: {
  id?: string;
  isModalView?: boolean;
}) {
  const { push } = useRouter();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const {
    data,
    isLoading: isFetching,
    error: fetchError,
  } = useStoreManagerById(id || '');
  const {
    mutate: createStoreManager,
    data: storeManagerData,
    status: createStatus,
  } = useCreateStoreManager();

  const {
    mutate: updateStoreManager,
    data: updateResponseData,
    status: updateStatus,
  } = useUpdateStoreManager();

  useEffect(() => {
    if (data) {
      const detailData = data?.data;
      const resetData = {
        id: detailData?.id || null,
        first_name: detailData?.first_name || '',
        last_name: detailData?.last_name || '',
        email: detailData?.email || '',
        phone_number: detailData?.phone_number || '',
        username: detailData?.username || '',
        password: detailData?.password || '',
        is_active: detailData?.is_active || false,
        store_name: detailData?.store_info?.name || '',
        store_address: detailData?.store_info?.address || '',
      };
      setReset(resetData);
    }
  }, [data]);

  const onSubmit: SubmitHandler<StoreManagerFormInput> = (data) => {
    setLoading(true);
    let payload = {
      id: id || null,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
      phone_number: data.phone_number || '',
      username: data.username || '',
      password: data.password || undefined,
      is_active: data.is_active || false,
      store_name: data.store_name || '',
      store_address: data.store_address || '',
    };

    id ? updateStoreManager(payload) : createStoreManager(payload);
  };

  useEffect(() => {
    if (createStatus === 'pending' || updateStatus === 'pending') return;

    if (
      (createStatus === 'success' && storeManagerData) ||
      (updateStatus === 'success' && updateResponseData)
    ) {
      toast.success(
        id ? 'Salesman updated successfully' : 'Salesman created successfully'
      );

      setReset(DefaultValues);

      push(routes.eCommerce.storeManager);

      setLoading(false);
    } else if (createStatus === 'error' || updateStatus === 'error') {
      toast.error('Something went wrong');
      setLoading(false);
    }
  }, [createStatus, updateStatus]);

  if (isFetching) return <PageLoader />;

  if (fetchError) throw fetchError;

  return (
    <Form<StoreManagerFormInput>
      validationSchema={getStoreManagerFormSchema(!!id)}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        mode: 'onChange',
        defaultValues: DefaultValues,
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
                title="Email & Phone Number"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  className="flex-grow"
                  prefix={
                    <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                  }
                  type="email"
                  placeholder="georgia.young@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Controller
                  name="phone_number"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <PhoneNumber
                      country="in"
                      value={value}
                      onChange={onChange}
                      className="rtl:[&>.selected-flag]:right-0"
                      inputClassName="rtl:pr-12"
                      buttonClassName="rtl:[&>.selected-flag]:right-2 rtl:[&>.selected-flag_.arrow]:-left-6"
                      error={errors.phone_number?.message}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup
                title={'Store Details'}
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  placeholder="Store Name"
                  {...register('store_name')}
                  error={errors.store_name?.message}
                  className="col-span-full"
                />
                <Textarea
                  placeholder="Store Address"
                  {...register('store_address')}
                  error={errors.store_address?.message}
                  className="col-span-full"
                />
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
                {!id && (
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                      <Password
                        placeholder="Enter your password"
                        helperText={
                          value &&
                          value?.length < 8 &&
                          'Your current password must be more than 8 characters'
                        }
                        onChange={onChange}
                        error={errors.password?.message}
                      />
                    )}
                  />
                )}
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
              {id ? 'Update' : 'Create'} Store Manager
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
